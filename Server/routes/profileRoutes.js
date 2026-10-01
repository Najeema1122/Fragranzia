const express = require("express");

const router = express.Router();

const checkAuth = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    getProfile,
    updateProfile,
    getAllUsers,
    toggleBlockUser
} = require("../controllers/profileControllers");


// ================================
// USER PROFILE
// ================================

router.get(
    "/",
    checkAuth,
    getProfile
);

router.put(
    "/",
    checkAuth,
    updateProfile
);


// ================================
// ADMIN USER MANAGEMENT
// ================================

router.get(
    "/admin/users",
    checkAuth,
    adminMiddleware,
    getAllUsers
);

router.put(
    "/admin/users/:id/block",
    checkAuth,
    adminMiddleware,
    toggleBlockUser
);


module.exports = router;