require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");

const productRoutes=require("./routes/productRoutes");
const catRoutes=require("./routes/catRoutes");
const authRoutes=require("./routes/authRoutes")
const cartRoutes=require('./routes/cartRoutes')
const wishRoutes=require('./routes/wishRoutes')
const profileRoutes=require('./routes/profileRoutes')
const addressRoutes=require('./routes/addressRoutes')
const orderRoutes = require("./routes/orderRoutes");


const app=express();
app.use(cors());  //middleware
app.use(express.json());
app.use("/uploads",express.static("uploads"));//the images are stored in the uploads

// Vercel can start processing a request before the first DB connection settles.
app.use(async (req, res, next) => {
    try {
        await connectDb();
        next();
    } catch (error) {
        console.error("Database connection failed:", error.message);
        res.status(503).json({
            success: false,
            message: "Database unavailable"
        });
    }
});

//routes

app.use("/api/address",addressRoutes)
app.use("/api/wish_list/",wishRoutes)
app.use("/api/cart/",cartRoutes)
app.use("/auth/",authRoutes);
app.use("/api/order", orderRoutes);
app.use("/admin/add_product",productRoutes);
app.use("/admin/add_category",catRoutes)
app.use("/api/profile",profileRoutes)
module.exports = app;
