const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const protect = require('../middleware/authMiddleware');

// Create a new post
router.post('/', protect,  postController.createPost);

// Get all posts for a shelf
router.get('/shelf/:shelfId', postController.getPostsByShelf);

// Get a single post
router.get('/:id', postController.getPost);

// Update a post
router.put('/:id', protect, postController.updatePost);

// Delete a post
router.delete('/:id', protect, postController.deletePost);

router.get('/', postController.getAllPosts);

module.exports = router;