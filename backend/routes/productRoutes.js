// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Adjust the path based on your structure

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find(); // Fetch products from MongoDB
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new product
router.post('/', async (req, res) => {
    const product = new Product(req.body);
    try {
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// You can add more routes for PUT, DELETE, etc.

module.exports = router;
