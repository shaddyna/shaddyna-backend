/*const express = require('express');
const router = express.Router();
const {  getProductsByCategory, addProduct, getAllProducts, editProduct, deleteProduct, getProductById } = require('../controllers/productController')

router.post('/add', addProduct);

// Route to get all products
router.get('/all', getAllProducts);

// Route to edit a product
router.put('/update/:productId', editProduct);

// Route to delete a product
router.delete('/delete/:productId', deleteProduct);

router.get('/:productId', getProductById);

router.get('/', getProductsByCategory);

module.exports = router;*/

const express = require('express');
const multer = require("multer");
// Multer setup
const storage = multer.memoryStorage(); // Store in memory before uploading to Cloudinary
const upload = multer({ storage });
const router = express.Router();
const { 
  getProductsByCategory, 
  addProduct, 
  getAllProducts, 
  editProduct, 
  deleteProduct, 
  getProductById, 
  createProduct,
  getRelatedProducts,
  getProductsBySellerId // Import the new controller function
} = require('../controllers/productController');

// Route to add a product
router.post('/add', addProduct);

// Route to get all products
router.get('/all', getAllProducts);

// Route to edit a product
router.put('/update/:productId', editProduct);

// Route to delete a product
router.delete('/delete/:productId', deleteProduct);

// Route to get a product by ID
router.get('/:productId', getProductById);

// Route to get products by category
router.get('/', getProductsByCategory);

// Route to get products by sellerId
router.get('/:id', getProductsBySellerId);


router.get("/related/:id", getRelatedProducts);

router.post("/", upload.array("images", 5), createProduct);

module.exports = router;

