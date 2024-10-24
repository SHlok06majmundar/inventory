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
app.use(express.json());  // Parse JSON bodies

// Import routes
const routes = {
    users: require('./routes/userRoutes'),
    products: require('./routes/productRoutes')
};

// API Routes
app.use('/api/users', routes.users);       // User-related routes
app.use('/api/products', routes.products); // Product-related routes

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
