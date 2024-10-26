const express = require('express');
const router = express.Router();
const {
    addProduct,
    updateProduct,
    deleteProduct,
    getAllProducts
} = require('../controllers/productController');

// API routes
router.get('/', getAllProducts); // GET all products
router.post('/', addProduct); // POST a new product
router.put('/:id', updateProduct); // PUT update an existing product
router.delete('/:id', deleteProduct); // DELETE a product by ID

module.exports = router;
