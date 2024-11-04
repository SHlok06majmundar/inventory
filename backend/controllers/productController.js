// controllers/productController.js
const Product = require('../models/Product'); // Import the Product model

// Get products for the logged-in user
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  const { name, price, quantity, category, purchaseDate, serialNumber } = req.body;
  const image = req.file ? req.file.path : null;

  // Validate required fields
  if (!name || price == null || quantity == null) {
    return res.status(400).json({
      message: 'Name, price, and quantity are required fields.'
    });
  }

  try {
    const product = new Product({
      name,
      price,
      quantity,
      category,
      purchaseDate,
      serialNumber,
      image,
      user: req.user._id
    });
    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity, category, purchaseDate, serialNumber } = req.body;
  const image = req.file ? req.file.path : null;

  // Validate required fields
  if (!name || price == null || quantity == null) {
    return res.status(400).json({
      message: 'Name, price, and quantity are required fields.'
    });
  }

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { name, price, quantity, category, purchaseDate, serialNumber, image },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    res.json({ message: 'Product updated successfully', updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: id, user: req.user._id });

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};
