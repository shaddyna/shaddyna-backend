const express = require('express');
const { getAllUsers, getUserById, editUser } = require('../controllers/userController');
const router = express.Router();

// Route to get all users
router.get('/all', getAllUsers);

// Route to get a single user by ID
router.get('/:id', getUserById);

// Route to edit a user
router.put('/:id', editUser);

router.get('/bulk', async (req, res) => {
    try {
      const ids = req.query.ids?.split(',') || [];
      if (!ids.length) {
        return res.status(400).json({ message: 'No user IDs provided' });
      }
  
      const users = await User.find({
        _id: { $in: ids },
        deleted: { $ne: true }
      }).select('firstName lastName email image role');
  
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Server error while fetching users' });
    }
  });

module.exports = router;
