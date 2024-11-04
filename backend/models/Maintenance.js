const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  serviceType: { type: String, required: true },
  dateOfService: { type: Date, required: true },
  costOfService: { type: Number, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Add this line
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
