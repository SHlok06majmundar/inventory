// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  serialNumber: { type: String, required: true },
  image: { type: String, required: true }, // Store the path or URL of the image
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
