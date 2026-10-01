const express=require("express");
const router=express.Router();

const{addToWishList,getWishList,deleteWishList}=require("../controllers/wishControllers")


const checkAuth = require("../middleware/authMiddleware");

router.post("/",checkAuth,addToWishList);

router.get("/", checkAuth, getWishList);

router.delete("/:productId", checkAuth, deleteWishList);


module.exports=router;