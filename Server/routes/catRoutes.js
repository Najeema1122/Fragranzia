const express=require("express");
const router=express.Router();

const{getCategory,createCategory,onHandleStatus}=require("../controllers/catControllers");


//get the products 
router.get("/",getCategory);

//create productsconst

router.post("/",createCategory)

//update status

router.put("/:id", onHandleStatus);

module.exports=router;