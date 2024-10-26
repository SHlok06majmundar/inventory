// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure unique email
  },
  username: {
    type: String,
    required: true,
    unique: true, // Ensure unique username
  },
  password: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('User', userSchema);
