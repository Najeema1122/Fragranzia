const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload")
const checkAuth = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const { getProducts, createProduct,updateProduct,blockProduct,getActiveProducts} = require("../controllers/productControllers");


//get the products 
router.get("/", getProducts);

//create products

router.post("/", checkAuth, adminMiddleware, upload.single("image"), createProduct)
router.put("/:id", checkAuth, adminMiddleware, updateProduct);
router.put("/:id/block", checkAuth, adminMiddleware, blockProduct);
router.get("/shop", getActiveProducts);

module.exports = router;
