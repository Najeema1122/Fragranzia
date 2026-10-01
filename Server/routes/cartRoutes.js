
const express = require("express");

const router = express.Router();

const {
    addToCart,
    getCart,
    postQuantity,
    removeFromCart
} = require("../controllers/cartControllers");

const checkAuth = require("../middleware/authMiddleware");


// Add product to cart
router.post(
    "/add",
    checkAuth,
    addToCart
);


// Get cart
router.get(
    "/",
    checkAuth,
    getCart
);


// Update quantity
router.put(
    "/quantity/:productId",
    checkAuth,
    postQuantity
);


// Delete product from cart
router.delete(
    "/:productId",
    checkAuth,
    removeFromCart
);


module.exports = router;

