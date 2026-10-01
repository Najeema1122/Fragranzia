const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        orderItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],

        shippingAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
            required: true
        },

        paymentMethod: {
            type: String,
            required: true
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending"
        },

        paidAt: {
            type: Date,
            default: null
        },

        totalPrice: {
            type: Number,
            required: true
        },

        balanceTotal: {
            type: Number,
            required: true
        },

        // Delivery Status
        deliveryStatus: {
            type: String,
            enum: [
                "Pending",
                "Processing",
                "Shipped",
                "Out for Delivery",
                "Delivered",
                "Cancelled",
                "Returned",
                "Failed Delivery"
            ],
            default: "Pending"
        },

        deliveredAt: {
            type: Date
        },

        // Razorpay & Shiprocket
        razorpay_order_id: {
            type: String
        },

        shipment_id: {
            type: String
        },

        awb_code: {
            type: String
        },

        courier_name: {
            type: String
        },

        courier_status: {
            type: String
        },

        // Return
        isReturned: {
            type: Boolean,
            default: false
        },

        returnReason: {
            type: String,
            enum: [
                "Damaged Product",
                "Wrong Item Received",
                "Defective Product",
                "Item Not as Described",
                "Size/Color Mismatch",
                "Other"
            ]
        },

        returnStatus: {
            type: String,
            enum: [
                "Requested",
                "Approved",
                "Rejected",
                "Completed"
            ],
            default: "Requested"
        },

        returnedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = {
    Order: mongoose.model("Order", orderSchema)
};