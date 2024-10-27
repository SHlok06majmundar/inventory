// backend/controllers/productController.js
const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const { name, price, quantity, category, purchaseDate, serialNumber } = req.body;
    const image = req.file.path; // Assuming multer is used to handle file uploads

    const product = await Product.create({ 
      name, 
      price, 
      quantity, 
      category, 
      purchaseDate, 
      serialNumber, 
      image 
    });

    return res.status(201).json({ product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.image = req.file.path; // Update image if a new one is uploaded
    }

    const product = await Product.findByIdAndUpdate(id, updatedData, { new: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(204).send(); // No content
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
