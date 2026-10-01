const express = require("express");

const router = express.Router();
const checkAuth = require("../middleware/authMiddleware");

const {
    placeOrder,
    getOrders,
    cancelOrder,
    returnOrder,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderControllers");

const { getDashboardStats } = require("../controllers/dashboardController");


router.post("/place", checkAuth, placeOrder);

router.get("/", checkAuth, getOrders);

router.put("/:id/cancel", checkAuth, cancelOrder);

router.put("/:id/return", checkAuth, returnOrder);


router.get("/admin/all", checkAuth, getAllOrders);

router.get("/admin/stats", checkAuth, getDashboardStats);

router.put("/admin/:id/status", checkAuth, updateOrderStatus);


module.exports = router;