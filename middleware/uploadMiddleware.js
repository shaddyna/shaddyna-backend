/*const multer = require("multer");

// Set up multer for image upload (we're not saving images locally anymore)
const storage = multer.memoryStorage(); // Store the file in memory instead of disk
const upload = multer({ storage: storage });

module.exports = upload;*/

const multer = require('multer');

// Set up multer for image upload (we're not saving images locally anymore)
const storage = multer.memoryStorage(); // Store the file in memory instead of disk
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
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

module.exports = upload;
