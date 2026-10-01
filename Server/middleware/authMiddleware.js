const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {

    console.log(
        "Authorization Header:",
        req.headers.authorization
    );

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "No Token"
        });
    }

    try {

        let token = authHeader;

        // =========================
        // SUPPORT BEARER TOKEN
        // =========================

        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("Decoded:", decoded);

        req.userId = decoded._id;

        next();

    } catch (error) {

        console.log(
            "JWT Error:",
            error.message
        );

        return res.status(401).json({
            message: "Not Authorized"
        });
    }
};

module.exports = checkAuth;