// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Import routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes'); // Import user routes

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes); // Use user routes here

// Log MongoDB URI for debugging
console.log('MongoDB URI:', process.env.MONGO_URI);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
