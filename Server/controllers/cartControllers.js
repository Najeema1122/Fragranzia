const User = require("../models/User");
const Product = require("../models/Product");

// =====================================================
// ADD TO CART
// =====================================================

const addToCart = async (req, res) => {

    console.log(req.body);
    console.log(req.headers.authorization);

    try {

        const { productId } = req.body;

        // Logged-in user id from auth middleware
        const userId = req.userId;

        // ---------------------------------------------
        // CHECK PRODUCT
        // ---------------------------------------------

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // ---------------------------------------------
        // FIND USER
        // ---------------------------------------------

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // ---------------------------------------------
        // CHECK IF PRODUCT ALREADY EXISTS
        // ---------------------------------------------

        const existingProduct = user.cart.find(
            (item) =>
                item.product &&
                item.product.toString() === productId
        );

        if (existingProduct) {

            return res.status(400).json({
                success: false,
                message: "Item already in the cart",
            });

        }

        // ---------------------------------------------
        // ADD PRODUCT
        // ---------------------------------------------

        user.cart.push({
            product: productId,
            quantity: 1,
        });

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            cart: user.cart,
        });

    } catch (error) {

        console.error("Add to cart error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


// =====================================================
// GET CART
// =====================================================

const getCart = async (req, res) => {

    try {

        const user = await User.findById(req.userId)
            .populate("cart.product");

        // ---------------------------------------------
        // CHECK USER
        // ---------------------------------------------

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        // ---------------------------------------------
        // REMOVE BROKEN PRODUCT REFERENCES
        // ---------------------------------------------

        const validCart = user.cart.filter(
            (item) => item.product !== null
        );

        // ---------------------------------------------
        // SAVE CLEANED CART
        // ---------------------------------------------

        if (validCart.length !== user.cart.length) {

            user.cart = validCart;

            await user.save();
        }

        // ---------------------------------------------
        // SEND CART
        // ---------------------------------------------

        return res.status(200).json({
            success: true,
            cart: validCart,
        });

    } catch (error) {

        console.error("Get cart error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get cart",
            error: error.message
        });
    }
};


// =====================================================
// UPDATE QUANTITY
// =====================================================

const postQuantity = async (req, res) => {

    try {

        const { productId } = req.params;
        const { quantity } = req.body;
        const userId = req.userId;

        // ---------------------------------------------
        // CHECK USER
        // ---------------------------------------------

        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        // ---------------------------------------------
        // FIND CART ITEM
        // ---------------------------------------------

        const item = user.cart.find(
            (item) =>
                item.product &&
                item.product.toString() === productId
        );

        if (!item) {

            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });

        }

        // ---------------------------------------------
        // VALIDATE QUANTITY
        // ---------------------------------------------

        if (!quantity || quantity < 1) {

            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });

        }

        // ---------------------------------------------
        // UPDATE QUANTITY
        // ---------------------------------------------

        item.quantity = quantity;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Quantity updated successfully",
            cart: user.cart
        });

    } catch (error) {

        console.error("Update quantity error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// REMOVE FROM CART
// =====================================================

const removeFromCart = async (req, res) => {

    try {

        const userId = req.userId;
        const { productId } = req.params;

        // ---------------------------------------------
        // FIND USER
        // ---------------------------------------------

        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        // ---------------------------------------------
        // CHECK PRODUCT IN CART
        // ---------------------------------------------

        const cartItem = user.cart.find(
            (item) =>
                item.product &&
                item.product.toString() === productId
        );

        if (!cartItem) {

            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });

        }

        // ---------------------------------------------
        // REMOVE PRODUCT
        // ---------------------------------------------

        user.cart = user.cart.filter(
            (item) =>
                item.product &&
                item.product.toString() !== productId
        );

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: user.cart
        });

    } catch (error) {

        console.error("Remove cart item error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to remove product from cart",
            error: error.message
        });
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    addToCart,
    getCart,
    postQuantity,
    removeFromCart
};