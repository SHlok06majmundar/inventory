// backend/controllers/userController.js
const User = require('../models/User'); // Adjust the path as needed
const bcrypt = require('bcryptjs');

// Function to register a new user
const registerUser = async (req, res) => {
  const { name, email, username, password } = req.body;

  // Check for missing fields
  if (!name || !email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Check if the username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken. Please choose a different one.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ name, email, username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ message: 'Username or email already exists. Please choose a different one.' });
    }
    console.error('Registration error:', error);
    res.status(500).json({ message: 'An error occurred while registering.' });
  }
};

// Function to log in a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check for missing fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    res.status(200).json({ message: 'Login successful!' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred while logging in.' });
  }
};

module.exports = { registerUser, loginUser };
