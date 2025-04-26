/*const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../utils/Cloudinary');
const protect= require('../middleware/authMiddleware');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 3 // Max 3 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

router.post('/', protect, upload.array('images', 3), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images provided' });
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'shelf-posts' },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );

        stream.end(file.buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);
    res.status(200).json({ urls });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Error uploading images', error: error.message });
  }
});

module.exports = router;*/

const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../utils/Cloudinary');
const protect = require('../middleware/authMiddleware');

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 3
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// POST route for image upload
router.post('/', protect,  upload.array('images', 3), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      console.warn('❌ No images provided in the request');
      return res.status(400).json({ message: 'No images provided' });
    }

    console.log(`📦 Received ${req.files.length} file(s) for upload`);

    const uploadPromises = req.files.map((file, index) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'shelf-posts' },
          (error, result) => {
            if (error) {
              console.error(`❌ Failed to upload image #${index + 1}:`, error.message);
              reject(error);
            } else {
              console.log(`✅ Image #${index + 1} uploaded successfully: ${result.secure_url}`);
              resolve(result.secure_url);
            }
          }
        );

        stream.end(file.buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);
    console.log('🎉 All images uploaded successfully');
    res.status(200).json({ urls });
  } catch (error) {
    console.error('❌ Error during image upload:', error.message);
    res.status(500).json({ message: 'Error uploading images', error: error.message });
  }
});

module.exports = router;
