const express = require("express");

const router = express.Router();
const checkAuth = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    placeOrder,
    verifyPayment,
    getOrders,
    cancelOrder,
    returnOrder,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderControllers");

const { getDashboardStats } = require("../controllers/dashboardController");


router.post("/place", checkAuth, placeOrder);

// No checkAuth here: the Razorpay signature check authenticates this request
router.post("/verify-payment", verifyPayment);

router.get("/", checkAuth, getOrders);

router.put("/:id/cancel", checkAuth, cancelOrder);

router.put("/:id/return", checkAuth, returnOrder);


router.get("/admin/all", checkAuth, adminMiddleware, getAllOrders);

router.get("/admin/stats", checkAuth, adminMiddleware, getDashboardStats);

router.put("/admin/:id/status", checkAuth, adminMiddleware, updateOrderStatus);


module.exports = router;
