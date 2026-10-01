

const Product = require("../models/Product");

//  CREATE PRODUCT (POST)
const createProduct = async (req, res) => {
  console.log(req.body);
  console.log(req.file.path) // ✅ Cloudinary hosted URL, not local filename
  try {
    const { product_name, product_category, price, sales_price, description, stock } = req.body;

    const product = new Product({
      product_name,
      product_category,
      price: Number(price),
      sales_price: Number(sales_price),
      description,
      stock,
      image: req.file.path,          // ✅ full Cloudinary URL, e.g. https://res.cloudinary.com/.../products/abc123.jpg
      imagePublicId: req.file.filename, // ✅ Cloudinary public_id — save this so you can delete the image later
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// UPDATED PRODUCT
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedProduct);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

//  GET ALL PRODUCTS (GET) 
const getProducts = async (req, res) => {
  console.log("product is called")

  try {
    const products = await Product.find().populate("product_category");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const blockProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.status = !product.status;

        await product.save();

        console.log(savedProduct)

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getActiveProducts = async (req, res) => {
    try {
        const products = await Product.find({
            status: false
        }).populate("product_category");

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  blockProduct,
  getActiveProducts
};