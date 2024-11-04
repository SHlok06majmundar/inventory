const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const userController = require('../controllers/userController');

router.use(userController.protect); // Protect all routes with authentication

router.post('/', maintenanceController.createMaintenance);
router.get('/', maintenanceController.getMaintenances);
router.put('/:id', maintenanceController.updateMaintenance);
router.delete('/:id', maintenanceController.deleteMaintenance);

module.exports = router;
