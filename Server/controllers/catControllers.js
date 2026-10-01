const Category = require("../models/Category");

//  CREATE CATEGORY (POST)
const createCategory = async (req, res) => {
  try {
    const { category_name, description ,status} = req.body
    const category = new Category({
      category_name, description,status
    });
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  GET ALL CATEGORIES (GET)
const getCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const onHandleStatus = async (req, res) => {

  console.log(req.body)
  try {
    const category = await Category.findById(req.params.id);

    console.log(category)

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Toggle status
    category.status = !category.status;

    await category.save();

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCategory,
  getCategory,
  onHandleStatus
};