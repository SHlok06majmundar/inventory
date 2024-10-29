const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  purchaseDate: { type: Date },
  serialNumber: { type: String },
  image: { type: String } // Path to the image file
});

module.exports = mongoose.model('Product', productSchema);
