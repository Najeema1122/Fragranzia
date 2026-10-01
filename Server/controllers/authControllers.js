const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");


// ========================================
// REGISTER
// ========================================

const register = async (req, res) => {

    try {

        const { name, email, password, phone } = req.body;

        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({
                message: "user exist"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            phone
            // role is automatically "user"
        });

        res.status(201).json({
            message: "Registered Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


// ========================================
// LOGIN
// ========================================

const login = async (req, res) => {

    console.log(req.body);

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "invalid email"
            });
        }

        // =========================
        // CHECK BLOCKED USER
        // =========================

        if (user.isBlocked) {
            return res.status(403).json({
                message: "Your account has been blocked"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "password is incorrect"
            });
        }

        // =========================
        // CREATE TOKEN
        // =========================

        const token = jwt.sign(
            {
                _id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1y"
            }
        );

        res.status(200).json({

            token,

            message: "login successful",

            // send role to frontend
            role: user.role

        });

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({
            message: "log in not successful"
        });
    }
};


// ========================================
// HOME
// ========================================

const home = async (req, res) => {

    try {

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Welcome to the home page",
            user: {
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    register,
    login,
    home
};