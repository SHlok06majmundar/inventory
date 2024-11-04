const Maintenance = require('../models/Maintenance');
const Product = require('../models/Product');

// Create a new maintenance record
exports.createMaintenance = async (req, res) => {
  try {
    const { serviceType, dateOfService, costOfService, product } = req.body;

    const maintenance = await Maintenance.create({
      serviceType,
      dateOfService,
      costOfService,
      product,
      user: req.user.id, // Associate maintenance with the user
    });

    res.status(201).json(maintenance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all maintenance records for the logged-in user
exports.getMaintenances = async (req, res) => {
  try {
    const maintenances = await Maintenance.find({ user: req.user.id }).populate('product', 'name'); // Fetch only the maintenance records for the logged-in user
    res.status(200).json(maintenances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a maintenance record
exports.deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenance = await Maintenance.findOneAndDelete({ _id: id, user: req.user.id }); // Ensure the record belongs to the user

    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance record not found or not authorized' });
    }

    res.status(200).json({ message: 'Maintenance record deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing maintenance record
exports.updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceType, dateOfService, costOfService, product } = req.body;

    const maintenance = await Maintenance.findOneAndUpdate(
      { _id: id, user: req.user.id }, // Ensure the record belongs to the user
      { serviceType, dateOfService, costOfService, product },
      { new: true, runValidators: true }
    );

    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance record not found or not authorized' });
    }

    res.status(200).json(maintenance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
