// const dns = require("dns");
// dns.setServers(['8.8.8.8', '8.8.4.4']);

require("dotenv").config();
const dns = require("dns");
dns.setServers(['8.8.8.8', '8.8.4.4']);
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
const PORT=process.env.PORT||5000;


//connect to database
connectDb();
app.use(cors());  //middleware
app.use(express.json());
app.use("/uploads",express.static("uploads"));//the images are stored in the uploads

//routes

app.use("/api/address",addressRoutes)
app.use("/api/wish_list/",wishRoutes)
app.use("/api/cart/",cartRoutes)
app.use("/auth/",authRoutes);
app.use("/api/order", orderRoutes);
app.use("/admin/add_product",productRoutes);
app.use("/admin/add_category",catRoutes)
app.use("/api/profile",profileRoutes)
app.listen(PORT,()=>{
    console.log(`BACKEND RUNNING AT http://localhost:${PORT}`);
})
