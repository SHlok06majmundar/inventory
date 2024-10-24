// backend/controllers/productController.js
const Product = require('../models/Product');

// Add a new product
exports.addProduct = async (req, res) => {
  const { name, price, quantity } = req.body;
  const userId = req.user.id;  // Ensure the user is attached via middleware

  try {
    const newProduct = new Product({ name, price, quantity, user: userId });
    await newProduct.save();
  
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

// Update an existing product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    // Find the product by ID
    const product = await Product.findById(id);
    
    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify if the user is authorized to update this product
    if (product.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    // Update the product with the new data
    Object.assign(product, updatedData);

    // Save the updated product
    const updatedProduct = await product.save();

    // Return the updated product to the client
    res.status(200).json(updatedProduct);
    
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};
