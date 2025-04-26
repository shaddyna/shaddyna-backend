const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const http = require("http");
const socketIo = require("socket.io");
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const shopRoutes = require("./routes/shopRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const skillRoutes = require("./routes/skillRoutes");
const memberRoutes = require('./routes/memberRoutes');
const shelfRoutes = require('./routes/shelfRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const savingRoutes = require('./routes/savingRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const chatRoutes = require('./routes/chatRoutes');
const seminarRoutes = require('./routes/seminarRoutes');
const startupRoutes = require('./routes/startupRoutes');
const seminarPaymentRoutes = require('./routes/seminarPaymentRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const transferRoutes = require('./routes/transferRoutes');
const withdrawRoutes = require('./routes/withdrawRoutes');
const investmentRoutes = require('./routes/investmentRoutes')
const postRoutes = require('./routes/postRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Set up Socket.io with Express
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "https://shaddyna-59if.onrender.com", "https://www.shaddyna.com", "https://shaddyna-frontend.onrender.com"], 
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"], 
    credentials: true, // Allow credentials (cookies, headers, etc.)
  },
  transports: ['websocket', 'polling'], // Allow both WebSocket and polling as a fallback
});

// Middleware setup for CORS
const cors = require('cors');
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "https://shaddyna-59if.onrender.com", "https://www.shaddyna.com", "https://shaddyna-frontend.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true, // Allow credentials (cookies, headers, etc.)
}));




// Middleware to pass the io instance to req
app.use((req, res, next) => {
  req.io = io;  // Add the io instance to the request object
  next();
});

// Middleware to parse JSON bodies
app.use(express.json()); 

// Configure multer for file uploads (set up storage configuration)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be uploaded
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save file with a unique name
  },
});

app.use("/api/skills", (req, res, next) => {
  console.log("Incoming request to /api/skills");
  console.log("Request Body:", req.body);
  console.log("Request Files:", req.files);

  if (err) {
    console.error("Multer Error:", err.message);
    return res.status(400).json({ error: err.message });
  }

  if (req.files) {
    req.files.forEach((file) => {
      console.log(`Received file: ${file.originalname}, type: ${file.mimetype}`);
    });
  }

  next();
});

// Connect to the database
connectDB();
console.log("Application is starting...");

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes); 
app.use('/api/sellers', sellerRoutes); 
app.use('/api/orders', orderRoutes); 
app.use("/api/shops", shopRoutes); 
app.use("/api/products", productRoutes); 
app.use('/api/categories', categoryRoutes); 
app.use("/api/skill", skillRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/shelf', shelfRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/saving', savingRoutes);
app.use('/api/purchase', purchaseRoutes);  
app.use('/api/chat', chatRoutes); 
app.use('/api/seminars', seminarRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/spayment', seminarPaymentRoutes)
app.use('/api/transactions', transactionRoutes);
app.use('/api/transfer', transferRoutes);
app.use('/api/withdraw', withdrawRoutes)
app.use('/api/investments', investmentRoutes) 
app.use('/api/shellf/posts', postRoutes);
app.use('/api/upload', uploadRoutes);

// Example on the server-side
io.on("connection", (socket) => {
  console.log(`\n🚀 New connection: User ${socket.id} connected`);

  // When a user joins a room
  socket.on("joinRoom", (roomId) => {
    console.log(`\n📥 User ${socket.id} joining room: ${roomId}`);
    socket.join(roomId);
    console.log(`✅ User ${socket.id} successfully joined room: ${roomId}`);
  });

  // When a user sends a message
  socket.on("sendMessage", (message) => {
    const roomId = `${message.sender}_${message.receiver}`;
    console.log(`\n💬 User ${message.sender} sending message to room: ${roomId}`);
    console.log(`📝 Message content: ${message.text}`);
    console.log(`👥 Room members: ${roomId}`);

    io.to(roomId).emit("receiveMessage", message); // Emit the message to the room
    console.log(`✅ Message sent to room ${roomId}, notifying receiver ${message.receiver}`);
  });

  // When a user leaves a room
  socket.on("leaveRoom", (roomId) => {
    console.log(`\n📤 User ${socket.id} leaving room: ${roomId}`);
    socket.leave(roomId);
    console.log(`✅ User ${socket.id} successfully left room: ${roomId}`);
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    console.log(`\n❌ User ${socket.id} disconnected`);
  });
});


// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});  