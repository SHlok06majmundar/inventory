const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const { name, price, quantity, category, purchaseDate, serialNumber } = req.body;
    const image = req.file ? req.file.path : ''; // Assuming multer is handling image uploads

    const product = await Product.create({
      name, price, quantity, category, purchaseDate, serialNumber, image
    });
    return res.status(201).json({ product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.image = req.file.path; // Update image if provided
    }

    const product = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
