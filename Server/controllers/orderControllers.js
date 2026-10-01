const { Order } = require("../models/Order");
const User = require("../models/User");
const Address = require("../models/Address");
const Product = require("../models/Product");


const placeOrder = async (req, res) => {

    try {

        // =========================================
        // 1. GET USER
        // =========================================

        const userId = req.userId;

        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }


        // =========================================
        // 2. CHECK CART
        // =========================================

        if (!user.cart || user.cart.length === 0) {

            return res.status(400).json({
                success: false,
                message: "Your cart is empty"
            });

        }


        // =========================================
        // 3. GET PRIMARY ADDRESS
        // =========================================

        const primaryAddress =
            await Address.findOne({
                user: userId,
                isPrimary: true
            });


        if (!primaryAddress) {

            return res.status(400).json({
                success: false,
                message:
                    "Please select a primary address"
            });

        }


        // =========================================
        // 4. PAYMENT METHOD
        // =========================================

        const { paymentMethod } = req.body;


        if (!paymentMethod) {

            return res.status(400).json({
                success: false,
                message:
                    "Payment method is required"
            });

        }


        // =========================================
        // 5. STORE CREATED ORDERS
        // =========================================

        const createdOrders = [];

        const skippedItems = [];


        // =========================================
        // 6. LOOP THROUGH CART
        // =========================================

        for (const cartItem of user.cart) {

            // -------------------------------------
            // FIND PRODUCT
            // -------------------------------------

            const product =
                await Product.findById(
                    cartItem.product
                );


            if (!product) {

                skippedItems.push({

                    product: cartItem.product,

                    reason:
                        "Product no longer exists"

                });

                continue;

            }


            // -------------------------------------
            // CHECK PRODUCT STATUS
            // -------------------------------------

            if (product.status === true) {

                skippedItems.push({

                    product: product._id,

                    name: product.product_name,

                    requestedQuantity:
                        cartItem.quantity,

                    availableStock:
                        product.stock,

                    reason:
                        "Product is not available for purchase"

                });

                continue;

            }


            // -------------------------------------
            // CHECK STOCK
            // -------------------------------------

            if (
                product.stock === undefined ||
                product.stock < cartItem.quantity
            ) {

                skippedItems.push({

                    product: product._id,

                    name: product.product_name,

                    requestedQuantity:
                        cartItem.quantity,

                    availableStock:
                        product.stock || 0,

                    reason:
                        "Insufficient stock"

                });

                continue;

            }


            // =====================================
            // ATOMIC STOCK UPDATE
            // =====================================

            const updatedProduct =
                await Product.findOneAndUpdate(

                    {
                        _id: product._id,

                        stock: {
                            $gte: cartItem.quantity
                        }
                    },

                    {
                        $inc: {
                            stock:
                                -Number(
                                    cartItem.quantity
                                )
                        }
                    },

                    {
                        new: true
                    }

                );


            if (!updatedProduct) {

                skippedItems.push({

                    product: product._id,

                    name: product.product_name,

                    requestedQuantity:
                        cartItem.quantity,

                    availableStock:
                        product.stock || 0,

                    reason:
                        "Insufficient stock"

                });

                continue;

            }


            // =====================================
            // GET PRICE
            // =====================================

            const price =
                Number(product.sales_price) > 0
                    ? Number(product.sales_price)
                    : Number(product.price);


            const quantity =
                Number(cartItem.quantity);


            const itemTotal =
                price * quantity;


            // =====================================
            // CREATE SEPARATE ORDER
            // =====================================

            const order =
                await Order.create({

                    user: userId,

                    orderItems: [

                        {
                            product: product._id,

                            quantity: quantity
                        }

                    ],

                    shippingAddress:
                        primaryAddress._id,

                    paymentMethod:
                        paymentMethod,

                    paymentStatus:
                        "Pending",

                    paidAt:
                        null,

                    totalPrice:
                        itemTotal,

                    balanceTotal:
                        itemTotal,

                    deliveryStatus:
                        "Pending"

                });


            // =====================================
            // SAVE ORDER
            // =====================================

            createdOrders.push(order);

        }


        // =========================================
        // 7. NOTHING COULD BE ORDERED
        // =========================================

        if (createdOrders.length === 0) {

            return res.status(400).json({

                success: false,

                message:
                    "None of the items in your cart are currently available",

                skippedItems

            });

        }


        // =========================================
        // 8. REMOVE ONLY ORDERED PRODUCTS
        // =========================================

        const orderedProductIds =
            createdOrders.flatMap(order =>

                order.orderItems.map(item =>
                    item.product.toString()
                )

            );


        user.cart =
            user.cart.filter(item =>

                !orderedProductIds.includes(
                    item.product.toString()
                )

            );


        await user.save();


        // =========================================
        // 9. POPULATE ORDERS
        // =========================================

        const populatedOrders =
            await Order.find({

                _id: {
                    $in:
                        createdOrders.map(
                            order => order._id
                        )
                }

            })

                .populate(
                    "orderItems.product"
                )

                .populate(
                    "shippingAddress"
                )

                .sort({
                    createdAt: -1
                });


        // =========================================
        // 10. RESPONSE
        // =========================================

        return res.status(201).json({

            success: true,

            message:
                skippedItems.length > 0
                    ? "Orders placed successfully for available items. Some items were skipped."
                    : "Orders placed successfully",

            orders:
                populatedOrders,

            skippedItems

        });


    } catch (error) {

        console.error(
            "Place Order Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to place order",

            error:
                error.message

        });

    }

};
const getOrders = async (req, res) => {

    try {

        const userId = req.userId;

        const orders = await Order.find({ user: userId })
            .populate("orderItems.product")
            .populate("shippingAddress")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {

        console.error("Get Orders Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });

    }

};


// =========================
// CANCEL ORDER (CUSTOMER)
// =========================
// The logged-in user cancels their own order, as long as it hasn't
// already reached Delivered / Cancelled / Returned.
// Per your call: no stock restoration, and paymentStatus is left as-is
// (no "Refunded" value exists in the schema, so it isn't touched here).

const NON_CANCELLABLE_STATUSES = ["Delivered", "Cancelled", "Returned"];

const cancelOrder = async (req, res) => {

    try {

        const userId = req.userId;
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to cancel this order"
            });
        }

        if (NON_CANCELLABLE_STATUSES.includes(order.deliveryStatus)) {
            return res.status(400).json({
                success: false,
                message: `Order cannot be cancelled once it is "${order.deliveryStatus}"`
            });
        }

        order.deliveryStatus = "Cancelled";

        await order.save();

        const populatedOrder = await Order.findById(order._id)
            .populate("orderItems.product")
            .populate("shippingAddress");

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order: populatedOrder
        });

    } catch (error) {

        console.error("Cancel Order Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to cancel order",
            error: error.message
        });

    }

};


// =========================
// GET ALL ORDERS (ADMIN)
// =========================
// Every order across every user, fully populated, newest first.
// The admin table flattens orderItems into one row per product,
// so no reshaping is needed here.

const getAllOrders = async (req, res) => {

    try {

        const orders = await Order.find({})
            .populate("user", "name email phone")
            .populate("orderItems.product", "product_name images price sales_price")
            .populate("shippingAddress")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {

        console.error("Get All Orders Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });

    }

};


// =========================
// UPDATE ORDER STATUS (ADMIN)
// =========================
// Body: { status } — must be one of the deliveryStatus enum values.

const ALLOWED_STATUSES = [
    "Pending",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
    "Returned",
    "Failed Delivery"
];

const updateOrderStatus = async (req, res) => {

    try {

        const { id } = req.params;
        const { status } = req.body;

        if (!status || !ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing status"
            });
        }

        const update = { deliveryStatus: status };

        if (status === "Delivered") {
            update.deliveredAt = new Date();
        }
        if (status === "Returned") {
            update.isReturned = true;
            update.returnedAt = new Date();
        }

        const order = await Order.findByIdAndUpdate(
            id,
            update,
            { new: true }
        )
            .populate("user", "name email phone")
            .populate("orderItems.product", "product_name images price sales_price")
            .populate("shippingAddress");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order status updated",
            order
        });

    } catch (error) {

        console.error("Update Order Status Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update order status",
            error: error.message
        });

    }

};

// =========================
// RETURN ORDER (CUSTOMER)
// =========================

const returnOrder = async (req, res) => {

    try {

        const userId = req.userId;
        const { id } = req.params;


        // =========================================
        // FIND ORDER
        // =========================================

        const order = await Order.findById(id);


        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }


        // =========================================
        // CHECK ORDER OWNER
        // =========================================

        if (order.user.toString() !== userId) {

            return res.status(403).json({
                success: false,
                message: "Not authorized to return this order"
            });

        }


        // =========================================
        // ONLY DELIVERED ORDERS CAN BE RETURNED
        // =========================================

        if (order.deliveryStatus !== "Delivered") {

            return res.status(400).json({
                success: false,
                message: "Only delivered orders can be returned"
            });

        }


        // =========================================
        // CHECK ALREADY RETURNED
        // =========================================

        if (order.isReturned === true) {

            return res.status(400).json({
                success: false,
                message: "This order has already been returned"
            });

        }


        // =========================================
        // UPDATE RETURN DETAILS
        // =========================================

        order.isReturned = true;

        order.deliveryStatus = "Returned";

        order.returnStatus = "Requested";

        order.returnedAt = new Date();


        // =========================================
        // SAVE
        // =========================================

        await order.save();


        // =========================================
        // POPULATE ORDER
        // =========================================

        const populatedOrder =
            await Order.findById(order._id)
                .populate("orderItems.product")
                .populate("shippingAddress");


        // =========================================
        // RESPONSE
        // =========================================

        return res.status(200).json({

            success: true,

            message:
                "Return request submitted successfully",

            order:
                populatedOrder

        });

    } catch (error) {

        console.error(
            "Return Order Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to return order",

            error:
                error.message

        });

    }

};


module.exports = {
    placeOrder,
    getOrders,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
     returnOrder
};