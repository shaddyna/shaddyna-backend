/*const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
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
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();



const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json()); // Middleware to parse JSON bodies

// Set up Socket.io with Express
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "https://www.shaddyna.com", "https://shaddyna-frontend.onrender.com"], 
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"], 
    credentials: true, 
  },
  transports: ['websocket', 'polling'], // Allow both WebSocket and polling as a fallback
});



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

const uploadMultiple = multer({ storage: storage }).array('images'); // Allow multiple image uploads
const upload = multer({ storage: storage }).single('image'); // For single file upload


// Apply multer middleware to the product routes (as it handles file uploads)
app.use("/api/products", (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message }); // Handle any multer errors
    }
    next(); // Proceed to the next middleware/route handler
  });
});

// Apply multer middleware to handle image uploads for shop creation
app.use("/api/shops", (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message }); // Handle any multer errors
    }
    next(); // Proceed to the next middleware/route handler
  });
});

// Apply multer middleware to handle image uploads for shop creation
// Apply multer middleware to handle image uploads for shop creation
app.use("/api/skills", (req, res, next) => {
  upload(req, res, (err) => {
    // Log the initial incoming request
    console.log("Incoming request to /api/skills");
    
    // Log the request body and files
    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files); // This will show an array of uploaded files, if any

    if (err) {
      // Log multer error details
      console.error("Multer Error:", err.message);

      // Respond with error details
      return res.status(400).json({ error: err.message });
    }

    // Log success if files are received correctly
    if (req.files) {
      req.files.forEach((file) => {
        console.log(`Received file: ${file.originalname}, type: ${file.mimetype}`);
      });
    }

    // Proceed to the next middleware or route handler
    next();
  });
});



// Connect to the database
connectDB();
// Trigger log at the start to confirm the server is running
console.log("Application is starting...");
// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/sellers', sellerRoutes); // Seller routes
app.use('/api/orders', orderRoutes); // Order routes
app.use("/api/shops", shopRoutes); // Shop routes
app.use("/api/products", productRoutes); // Product routes
app.use('/api/categories', categoryRoutes); // Category routes
app.use("/api/skill", skillRoutes); // Shop routes
app.use('/api/members', memberRoutes);
app.use('/api/shelf', shelfRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/saving', savingRoutes);
app.use('/api/purchase', purchaseRoutes);



// Set up Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected");

  // Handle incoming chat messages
  socket.on("sendMessage", (data) => {
    // Broadcast the message to the other user
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});*/



/*const express = require('express');
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
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Set up Socket.io with Express
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "https://www.shaddyna.com", "https://shaddyna-frontend.onrender.com"], 
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"], 
    credentials: true, // Allow credentials (cookies, headers, etc.)
  },
  transports: ['websocket', 'polling'], // Allow both WebSocket and polling as a fallback
});

const cors = require('cors');

// Middleware setup for CORS
app.use(cors({
  origin: ["http://localhost:3000", "https://www.shaddyna.com", "https://shaddyna-frontend.onrender.com"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true, // Allow credentials (cookies, headers, etc.)
}));


// Middleware
app.use(express.json()); // Middleware to parse JSON bodies

// Configure multer for file uploads (set up storage configuration)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be uploaded
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save file with a unique name
  },
});

const uploadMultiple = multer({ storage: storage }).array('images'); // Allow multiple image uploads
const upload = multer({ storage: storage }).single('image'); // For single file upload

// Apply multer middleware to the product routes (as it handles file uploads)
app.use("/api/products", (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message }); // Handle any multer errors
    }
    next(); // Proceed to the next middleware/route handler
  });
});

// Apply multer middleware to handle image uploads for shop creation
app.use("/api/shops", (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message }); // Handle any multer errors
    }
    next(); // Proceed to the next middleware/route handler
  });
});

// Apply multer middleware to handle image uploads for skills creation
app.use("/api/skills", (req, res, next) => {
  // Log the initial incoming request
  console.log("Incoming request to /api/skills");

  // Log the request body and files
  console.log("Request Body:", req.body);
  console.log("Request Files:", req.files); // This will show an array of uploaded files, if any

  if (err) {
    // Log multer error details
    console.error("Multer Error:", err.message);

    // Respond with error details
    return res.status(400).json({ error: err.message });
  }

  // Log success if files are received correctly
  if (req.files) {
    req.files.forEach((file) => {
      console.log(`Received file: ${file.originalname}, type: ${file.mimetype}`);
    });
  }

  // Proceed to the next middleware or route handler
  next();
});

// Connect to the database
connectDB();
// Trigger log at the start to confirm the server is running
console.log("Application is starting...");

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/sellers', sellerRoutes); // Seller routes
app.use('/api/orders', orderRoutes); // Order routes
app.use("/api/shops", shopRoutes); // Shop routes
app.use("/api/products", productRoutes); // Product routes
app.use('/api/categories', categoryRoutes); // Category routes
app.use("/api/skill", skillRoutes); // Shop routes
app.use('/api/members', memberRoutes);
app.use('/api/shelf', shelfRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/saving', savingRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('api/chat', chatRoutes);

// Set up Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected");

  // Handle incoming chat messages
  socket.on("sendMessage", (data) => {
    // Broadcast the message to the other user
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});*/




/*const express = require('express');
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
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Set up Socket.io with Express
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "https://www.shaddyna.com", "https://shaddyna-frontend.onrender.com"], 
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"], 
    credentials: true, // Allow credentials (cookies, headers, etc.)
  },
  transports: ['websocket', 'polling'], // Allow both WebSocket and polling as a fallback
});

// Middleware setup for CORS
const cors = require('cors');
app.use(cors({
  origin: ["http://localhost:3000", "https://www.shaddyna.com", "https://shaddyna-frontend.onrender.com"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
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

const uploadMultiple = multer({ storage: storage }).array('images'); // Allow multiple image uploads
const upload = multer({ storage: storage }).single('image'); // For single file upload

// Apply multer middleware to handle image uploads for different routes
app.use("/api/products", (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
});

// Apply multer middleware to handle image uploads for shop creation
app.use("/api/shops", (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
});

// Apply multer middleware to handle image uploads for skills creation
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


// Set up Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected");

  // Handle user joining a specific room (chat with specific receiver)
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // Handle user leaving the room
  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`User left room: ${roomId}`);
  });

  // Handle incoming chat messages
  socket.on("sendMessage", (data) => {
    // Create a unique room identifier for the sender and receiver
    const roomId = `${data.sender}_${data.receiver}`;

    // Emit message to the specific room (sender and receiver)
    io.to(roomId).emit("receiveMessage", data);
    console.log("Message sent to room:", roomId, data);
  });

  // Handle client disconnecting
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});



// Set up Socket.io connection
/*io.on("connection", (socket) => {
  console.log("New client connected");

  // Handle incoming chat messages
  socket.on("sendMessage", (data) => {
    // Save message to DB and broadcast it to the other user
    io.to(data.receiver).emit("receiveMessage", data);
    io.to(data.sender).emit("receiveMessage", data);
  });

  // Handle user joining a specific room (chat with specific receiver)
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined the room`);
  });

  // Handle user leaving the room
  socket.on("leaveRoom", (userId) => {
    socket.leave(userId);
    console.log(`User ${userId} left the room`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});*/

// Start the server
//const PORT = process.env.PORT || 5000;
//server.listen(PORT, () => {
  //console.log(`Server running on port ${PORT}`);
//});

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
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Set up Socket.io with Express
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "https://shaddyna-59if.onrender.com", "https://www.shaddyna.com", "https://shaddyna-frontend.onrender.com"], 
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"], 
    credentials: true, // Allow credentials (cookies, headers, etc.)
  },
  transports: ['websocket', 'polling'], // Allow both WebSocket and polling as a fallback
});

// Middleware setup for CORS
const cors = require('cors');
app.use(cors({
  origin: ["http://localhost:3000", "https://shaddyna-59if.onrender.com", "https://www.shaddyna.com", "https://shaddyna-frontend.onrender.com"],
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

const uploadMultiple = multer({ storage: storage }).array('images'); // Allow multiple image uploads
const upload = multer({ storage: storage }).single('image'); // For single file upload

// Apply multer middleware to handle image uploads for different routes
/*app.use("/api/products", (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
});*/

// Apply multer middleware to handle image uploads for shop creation
/*app.use("/api/shops", (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
});*/

// Apply multer middleware to handle image uploads for skills creation
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


// Set up Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected");

  // Handle user joining a specific room (chat with specific receiver)
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
    
  });

  // Handle user leaving the room
  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`User left room: ${roomId}`);
  });

  // Handle incoming chat messages
  socket.on("sendMessage", (data) => {
    // Create a unique room identifier for the sender and receiver
    const roomId = `${data.sender}_${data.receiver}`;

    // Emit message to the specific room (sender and receiver)
    io.to(roomId).emit("receiveMessage", data);
    console.log("Message sent to room:", roomId, data);
  });

  // Handle client disconnecting
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});  