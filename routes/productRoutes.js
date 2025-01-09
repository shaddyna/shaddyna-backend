const express = require('express');
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

module.exports = router;
