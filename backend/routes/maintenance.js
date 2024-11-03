const express = require('express');
const { createMaintenance, getMaintenances, deleteMaintenance, updateMaintenance } = require('../controllers/maintenanceController');

const router = express.Router();

router.route('/')
  .post(createMaintenance)
  .get(getMaintenances);

router.route('/:id')
  .delete(deleteMaintenance)
  .put(updateMaintenance); // Add this line to handle updates

module.exports = router;
