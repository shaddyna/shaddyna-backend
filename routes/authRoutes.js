// routes/authRoutes.js
/*const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;*/




const express = require('express');
const { loginUser, registerUser, getMe } = require('../controllers/authController');  // Import the function
const router = express.Router();
const  protect  = require('../middleware/authMiddleware');

router.post('/login', loginUser);  
router.get('/me', protect, getMe); 
router.post('/register', registerUser);

module.exports = router;


