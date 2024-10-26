// backend/controllers/productController.js
const Product = require('../models/Product');

// Function to get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'An error occurred while fetching products.' });
  }
};

// Function to create a new product
const createProduct = async (req, res) => {
  const { name, price, quantity } = req.body;

  // Check for missing fields
  if (!name || price === undefined || quantity === undefined) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newProduct = new Product({ name, price, quantity });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'An error occurred while creating the product.' });
  }
};

// Function to update a product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, { name, price, quantity }, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'An error occurred while updating the product.' });
  }
};

// Function to delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'An error occurred while deleting the product.' });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
