const express = require('express');
const multer = require('multer');
const { createProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Ensure the 'uploads' directory exists

// Route to get all products and create a product
router.route('/')
    .post(authMiddleware, upload.single('image'), createProduct)
    .get(authMiddleware, getProducts);

// Route to update and delete a product by ID
router.route('/:id')
    .put(authMiddleware, upload.single('image'), updateProduct)
    .delete(authMiddleware, deleteProduct);

module.exports = router;
