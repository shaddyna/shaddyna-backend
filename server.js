const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Configure CORS
const allowedOrigins = ['http://localhost:3000']; // Add your frontend URL here
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow credentials (cookies, headers, etc.)
  })
);

// Connect to the database
connectDB();

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/users', userRoutes);
app.use('/api/sellers', sellerRoutes); // Seller routes
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
