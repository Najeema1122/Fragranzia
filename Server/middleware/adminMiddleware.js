const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {

    try {

        // userId comes from checkAuth
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // =========================
        // CHECK ADMIN
        // =========================

        if (user.role !== "admin") {

            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only."
            });
        }

        // user is admin
        next();

    } catch (error) {

        console.error(
            "Admin middleware error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = adminMiddleware;