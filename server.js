/*const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const shopRoutes = require("./routes/shopRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Configure CORS
const allowedOrigins = ['http://localhost:3000', 'https://www.shaddyna.com','https://shaddyna-frontend.onrender.com']; // Add your frontend URL here
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
app.use("/api/shops", shopRoutes);
app.use("/api/products", productRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});*/

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const shopRoutes = require("./routes/shopRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Middleware to parse JSON bodies

// Configure CORS
const allowedOrigins = ['http://localhost:3000', 'https://www.shaddyna.com', 'https://shaddyna-frontend.onrender.com']; // Add your frontend URL here
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow credentials (cookies, headers, etc.)
  })
);

// Configure multer for file uploads (set up storage configuration)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be uploaded
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save file with a unique name
  },
});

const upload = multer({ storage: storage }).array('images'); // Allow multiple image uploads

// Apply multer middleware to the product routes (as it handles file uploads)
app.use("/api/products", (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message }); // Handle any multer errors
    }
    next(); // Proceed to the next middleware/route handler
  });
});

// Connect to the database
connectDB();

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/sellers', sellerRoutes); // Seller routes
app.use('/api/orders', orderRoutes); // Order routes
app.use("/api/shops", shopRoutes); // Shop routes
app.use("/api/products", productRoutes); // Product routes
app.use('/api/categories', categoryRoutes); // Category routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
