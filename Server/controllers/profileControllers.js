const User = require("../models/User");


// ========================================
// GET PROFILE
// ========================================

const getProfile = async (req, res) => {

    try {

        const userId = req.userId;

        const user = await User
            .findById(userId)
            .select("name email phone dob gender role isBlocked");

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ========================================
// UPDATE PROFILE
// ========================================

const updateProfile = async (req, res) => {

    try {

        const userId = req.userId;

        const {
            full_name,
            phone_number,
            dob,
            gender
        } = req.body;

        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.name = full_name;
        user.phone = phone_number;
        user.dob = dob;
        user.gender = gender;

        await user.save();

        res.status(200).json({

            success: true,

            message: "Profile updated successfully",

            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                dob: user.dob,
                gender: user.gender,
                role: user.role
            }
        });

    } catch (error) {

        console.error(
            "Update profile error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// ADMIN: GET ALL USERS
// ========================================

const getAllUsers = async (req, res) => {

    try {

        const users = await User
            .find()
            .select("name email phone isBlocked role createdAt");

        res.status(200).json({
            success: true,
            users,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ========================================
// ADMIN: BLOCK / UNBLOCK USER
// ========================================

const toggleBlockUser = async (req, res) => {

    try {

        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.isBlocked = !user.isBlocked;

        await user.save();

        res.status(200).json({

            success: true,

            message: `User ${
                user.isBlocked
                    ? "blocked"
                    : "unblocked"
            } successfully`,

            isBlocked: user.isBlocked,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = {
    getProfile,
    updateProfile,
    getAllUsers,
    toggleBlockUser,
};