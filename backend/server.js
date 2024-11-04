// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Import routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const maintenanceRoutes = require('./routes/maintenance'); // Adjust to your file name if different

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/maintenance', maintenanceRoutes); // Adjust the route path if needed

// Log MongoDB URI for debugging (optional)
console.log('MongoDB URI:', "mongodb+srv://majmundarshlok06:shlok1234@cluster0.ig1ya.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

// MongoDB connection
mongoose.connect("mongodb+srv://majmundarshlok06:shlok1234@cluster0.ig1ya.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
