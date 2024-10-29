const express = require('express');
const multer = require('multer');
const { createProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/productController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Ensure you have the uploads directory

router.route('/')
  .post(upload.single('image'), createProduct) // Handle image upload
  .get(getProducts);

router.route('/:id')
  .put(upload.single('image'), updateProduct)
  .delete(deleteProduct);

module.exports = router;
