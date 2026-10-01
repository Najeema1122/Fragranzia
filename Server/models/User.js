const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        // sparse: users without a phone are skipped by the unique index,
        // so many users can sign up without one
        phone: {
            type: String,
            unique: true,
            sparse: true,
        },

        password: {
            type: String,
            required: true
        },

        dob: {
            type: String
        },

        gender: {
            type: String
        },

        // =========================
        // USER ROLE
        // =========================
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        isBlocked: {
            type: Boolean,
            default: false
        },

        cart: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                },

                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],

        wishlist: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                },
            }
        ]
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);