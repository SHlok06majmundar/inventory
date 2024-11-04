const express = require('express');
const { register, login, protect } = require('../controllers/userController');
const router = express.Router();

// Define the routes
router.post('/register', register);
router.post('/login', login);

module.exports = router;
