const express=require("express");
const router=express.Router();
const checkAuth = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const{getCategory,createCategory,onHandleStatus}=require("../controllers/catControllers");


//get the products 
router.get("/",getCategory);

//create productsconst

router.post("/", checkAuth, adminMiddleware, createCategory)

//update status

router.put("/:id", checkAuth, adminMiddleware, onHandleStatus);

module.exports=router;
