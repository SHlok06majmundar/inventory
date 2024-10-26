// backend/routes/productRoutes.js
const express = require('express');
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const router = express.Router();

router.get('/', getAllProducts); // GET all products
router.post('/', createProduct); // POST new product
router.put('/:id', updateProduct); // PUT update product
router.delete('/:id', deleteProduct); // DELETE product

module.exports = router;
