const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload")

const { getProducts, createProduct,updateProduct,blockProduct,getActiveProducts} = require("../controllers/productControllers");


//get the products 
router.get("/", getProducts);

//create products

router.post("/", upload.single("image"), createProduct)
router.put("/:id", updateProduct);
router.put("/:id/block", blockProduct);
router.get("/shop", getActiveProducts);

module.exports = router;