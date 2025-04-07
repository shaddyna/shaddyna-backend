
/*const Shelf = require('../models/Shelf');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Helper function to upload files to Cloudinary
const uploadToCloudinary = async (files) => {
  const uploadPromises = files.map(file => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(file.path, { folder: 'shelf-products' }, (error, result) => {
        fs.unlinkSync(file.path); // Delete local file after upload
        if (error) return reject(error);
        resolve(result.secure_url);
      });
    });
  });
  
  return Promise.all(uploadPromises);
};


exports.createShelf = async (req, res) => {
  try {
    console.log('===== START OF REQUEST =====');
    console.log('Headers:', req.headers);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Body fields:', req.body);
    console.log('Files received:', req.files);

    // Log raw body for debugging (if using body-parser)
    console.log('Raw body:', JSON.stringify(req.body, null, 2));

    const { name, description, type, openForMembers } = req.body;
    console.log('Basic fields:', { name, description, type, openForMembers });

    let productDetails, serviceDetails, investmentDetails;
    let members = [];
    
    try {
      console.log('Attempting to parse JSON fields...');
      productDetails = req.body.productDetails ? JSON.parse(req.body.productDetails) : [];
      serviceDetails = req.body.serviceDetails ? JSON.parse(req.body.serviceDetails) : [];
      investmentDetails = req.body.investmentDetails ? JSON.parse(req.body.investmentDetails) : [];
      members = req.body.members ? JSON.parse(req.body.members) : [];
      
      console.log('Parsed productDetails:', productDetails);
      console.log('Parsed serviceDetails:', serviceDetails);
      console.log('Parsed investmentDetails:', investmentDetails);
      console.log('Parsed members:', members);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return res.status(400).json({
        success: false,
        message: "Invalid JSON data in form fields",
        error: parseError.message
      });
    }


    if (!name || !description) {
      return res.status(400).json({ 
        success: false,
        message: "Name and description are required" 
      });
    }

    // Validate type-specific details as arrays
    if (type === 'product' && (!Array.isArray(productDetails) || productDetails.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "At least one product detail is required"
      });
    }

    if (type === 'service' && (!Array.isArray(serviceDetails) || serviceDetails.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "At least one service detail is required"
      });
    }

    if (type === 'investment' && (!Array.isArray(investmentDetails) || investmentDetails.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "At least one investment detail is required"
      });
    }

    if (!Array.isArray(members)) {
      return res.status(400).json({ 
        success: false,
        message: "Members must be an array" 
      });
    }

    // Process member validation
    const memberIds = members.map(m => m.userId).filter(Boolean);
    if (memberIds.length > 0) {
      const existingUsers = await User.find({ _id: { $in: memberIds } });
      if (existingUsers.length !== memberIds.length) {
        return res.status(400).json({ 
          success: false,
          message: "One or more members do not exist" 
        });
      }
    }

    // Process product images
    if (type === 'product' && req.files) {
      try {
        // Group images by product index
        const productImagesMap = new Map();
        
        // Process files with format: productImages[0], productImages[1], etc.
        Object.keys(req.files).forEach(key => {
          const match = key.match(/productImages\[(\d+)\]/);
          if (match) {
            const index = parseInt(match[1]);
            if (!productImagesMap.has(index)) {
              productImagesMap.set(index, []);
            }
            productImagesMap.get(index).push(req.files[key][0]);
          }
        });

        // Upload images and add URLs to productDetails
        for (const [index, files] of productImagesMap) {
          if (productDetails[index]) {
            const uploaded = await uploadToCloudinary(files);
            productDetails[index].images = uploaded.map(img => img.secure_url);
          }
        }
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload product images"
        });
      }
    }

    const shelfData = {
      name,
      description,
      type,
      openForMembers: openForMembers !== 'false',
      members,
    };

    // Add the appropriate type details
    switch (type) {
      case 'product':
        shelfData.productDetails = productDetails;
        break;
      case 'service':
        shelfData.serviceDetails = serviceDetails;
        break;
      case 'investment':
        shelfData.investmentDetails = investmentDetails;
        break;
    }

    const shelf = new Shelf(shelfData);
    await shelf.save();

    res.status(201).json({
      success: true,
      data: shelf
    });

  } catch (error) {
    console.error("Error creating shelf:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error while creating shelf",
      error: error.message 
    });
  }
};

exports.upload = upload;


exports.getAllShelves = async (req, res) => {
  try {
    const shelves = await Shelf.find();
    res.status(200).json(shelves);
  } catch (error) {
    console.error("❌ Error fetching shelves:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get Single Shelf by ID
exports.getShelfById = async (req, res) => {
  try {
    const shelf = await Shelf.findById(req.params.id);
    if (!shelf) return res.status(404).json({ message: "Shelf not found" });

    res.status(200).json(shelf);
  } catch (error) {
    console.error("❌ Error fetching shelf:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};*/

















const Shelf = require('../models/Shelf');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const stream = require('stream');
const multer = require('multer');



// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

//const upload = multer({ storage: storage });
const upload = multer({ storage: multer.memoryStorage() });

// Helper function to upload files to Cloudinary
const uploadToCloudinary = async (files) => {
  const uploadPromises = files.map(file => {
    return new Promise((resolve, reject) => {
      // Create upload stream from buffer
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'shelf-products',
          resource_type: 'auto' // Automatically detect image/video
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(error);
          }
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id
          });
        }
      );

      // Convert buffer to stream and pipe to Cloudinary
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);
      bufferStream.pipe(uploadStream);
    });
  });

  return Promise.all(uploadPromises);
};


exports.createShelf = async (req, res) => {
  try {
    console.log('===== START OF REQUEST =====');
    console.log('Headers:', req.headers);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Body fields:', req.body);
    console.log('Files received:', req.files);

    // Log raw body for debugging (if using body-parser)
    console.log('Raw body:', JSON.stringify(req.body, null, 2));

    const { name, description, type, openForMembers } = req.body;
    console.log('Basic fields:', { name, description, type, openForMembers });

    let productDetails, serviceDetails, investmentDetails;
    let members = [];
    
    try {
      console.log('Attempting to parse JSON fields...');
      productDetails = req.body.productDetails ? JSON.parse(req.body.productDetails) : [];
      serviceDetails = req.body.serviceDetails ? JSON.parse(req.body.serviceDetails) : [];
      investmentDetails = req.body.investmentDetails ? JSON.parse(req.body.investmentDetails) : [];
      members = req.body.members ? JSON.parse(req.body.members) : [];
      
      console.log('Parsed productDetails:', productDetails);
      console.log('Parsed serviceDetails:', serviceDetails);
      console.log('Parsed investmentDetails:', investmentDetails);
      console.log('Parsed members:', members);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return res.status(400).json({
        success: false,
        message: "Invalid JSON data in form fields",
        error: parseError.message
      });
    }
    
    if (!name || !description) {
      return res.status(400).json({ 
        success: false,
        message: "Name and description are required" 
      });
    }

    // Validate type-specific details as arrays
    if (type === 'product' && (!Array.isArray(productDetails) || productDetails.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "At least one product detail is required"
      });
    }

    if (type === 'service' && (!Array.isArray(serviceDetails) || serviceDetails.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "At least one service detail is required"
      });
    }

    if (type === 'investment' && (!Array.isArray(investmentDetails) || investmentDetails.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "At least one investment detail is required"
      });
    }

    if (!Array.isArray(members)) {
      return res.status(400).json({ 
        success: false,
        message: "Members must be an array" 
      });
    }

    // Process member validation
    const memberIds = members.map(m => m.userId).filter(Boolean);
    if (memberIds.length > 0) {
      const existingUsers = await User.find({ _id: { $in: memberIds } });
      if (existingUsers.length !== memberIds.length) {
        return res.status(400).json({ 
          success: false,
          message: "One or more members do not exist" 
        });
      }
    }

if (type === 'product' && req.files) {
  try {
    console.log('Processing product images...');
    
    // Create a map to group images by their product index
    const productImagesMap = new Map();
    
    // Process all received files
    req.files.forEach(file => {
      const match = file.fieldname.match(/productImages\[(\d+)\]/);
      if (match) {
        const productIndex = parseInt(match[1]);
        if (!productImagesMap.has(productIndex)) {
          productImagesMap.set(productIndex, []);
        }
        productImagesMap.get(productIndex).push(file);
      }
    });

    console.log('Grouped images:', productImagesMap);
    
    // Upload images and add URLs to productDetails
    for (const [index, files] of productImagesMap) {
      if (productDetails[index]) {
        const uploadedImages = await uploadToCloudinary(files);
        productDetails[index].images = uploadedImages.map(img => img.secure_url);
        console.log(`Added ${uploadedImages.length} images to product ${index}`);
      }
    }
  } catch (uploadError) {
    console.error("Image upload error:", uploadError);
    return res.status(500).json({
      success: false,
      message: "Failed to upload product images",
      error: uploadError.message
    });
  }
}

    const shelfData = {
      name,
      description,
      type,
      openForMembers: openForMembers !== 'false',
      members,
    };

    // Add the appropriate type details
    switch (type) {
      case 'product':
        shelfData.productDetails = productDetails;
        break;
      case 'service':
        shelfData.serviceDetails = serviceDetails;
        break;
      case 'investment':
        shelfData.investmentDetails = investmentDetails;
        break;
    }

    const shelf = new Shelf(shelfData);
    await shelf.save();

    res.status(201).json({
      success: true,
      data: shelf
    });

    console.log('===== END OF REQUEST =====');
  } catch (error) {
    console.error('FULL ERROR:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false,
      message: "Server error while creating shelf",
      error: error.message 
    });
  }
};

exports.upload = upload;


exports.getAllShelves = async (req, res) => {
  try {
    const shelves = await Shelf.find();
    res.status(200).json(shelves);
  } catch (error) {
    console.error("❌ Error fetching shelves:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get Single Shelf by ID
exports.getShelfById = async (req, res) => {
  try {
    const shelf = await Shelf.findById(req.params.id);
    if (!shelf) return res.status(404).json({ message: "Shelf not found" });

    res.status(200).json(shelf);
  } catch (error) {
    console.error("❌ Error fetching shelf:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};