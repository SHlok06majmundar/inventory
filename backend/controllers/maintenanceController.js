const Maintenance = require('../models/Maintenance');
const Product = require('../models/Product');

exports.createMaintenance = async (req, res) => {
  try {
    const { serviceType, dateOfService, costOfService, product } = req.body;

    const maintenance = await Maintenance.create({
      serviceType,
      dateOfService,
      costOfService,
      product
    });

    res.status(201).json(maintenance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMaintenances = async (req, res) => {
  try {
    const maintenances = await Maintenance.find().populate('product', 'name');
    res.status(200).json(maintenances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    await Maintenance.findByIdAndDelete(id);
    res.status(200).json({ message: 'Maintenance record deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add the updateMaintenance function
exports.updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceType, dateOfService, costOfService, product } = req.body;

    const maintenance = await Maintenance.findByIdAndUpdate(
      id,
      { serviceType, dateOfService, costOfService, product },
      { new: true, runValidators: true }
    );

    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    res.status(200).json(maintenance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
