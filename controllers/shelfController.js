/*const Shelf = require('../models/Shelf');
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
};*/


const Shelf = require("../models/Shelf");
const cloudinary = require("../utils/Cloudinary");
const { v4: uuidv4 } = require("uuid");

// Create a new shelf
exports.createShelf = async (req, res) => {
  try {
    const { name, description, type, visibility, rules, tags } = req.body;
    const banner = req.file;

    // Upload banner image to Cloudinary (if provided)
    let imageUrl = "";
    if (banner) {
      const result = await cloudinary.uploader.upload(banner.path);
      imageUrl = result.secure_url;
    }

    // Create shelf document
    const shelf = new Shelf({
      name,
      description,
      bannerImage: imageUrl,
      createdBy: req.user.id,
      admins: [req.user.id],
      members: [{
        userId: req.user.id,
        role: "admin",
      }],
      type: Array.isArray(type) ? type : [type],
      visibility,
      inviteLink: uuidv4(),
      rules,
      tags: Array.isArray(tags) ? tags : [],
    });

    const newShelf = await shelf.save();
    res.status(201).json(newShelf);
  } catch (err) {
    console.error("Shelf creation error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get all shelves
exports.getAllShelves = async (req, res) => {
  try {
    // For now, return all shelves. You might want to add filtering/pagination later
    const shelves = await Shelf.find()
      .populate('createdBy', 'username email')
      .populate('admins', 'username email')
      .populate('members.userId', 'username email');
      
    res.json(shelves);
  } catch (err) {
    console.error("Error fetching shelves:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get shelf by ID
exports.getShelfById = async (req, res) => {
  try {
    const shelf = await Shelf.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('admins', 'username email')
      .populate('members.userId', 'username email');

    if (!shelf) {
      return res.status(404).json({ error: "Shelf not found" });
    }

    // Check if user has permission to view this shelf
    if (shelf.visibility === 'private' && 
        !shelf.members.some(m => m.userId.equals(req.user.id))) {
      return res.status(403).json({ error: "Not authorized to access this shelf" });
    }

    res.json(shelf);
  } catch (err) {
    console.error("Error fetching shelf:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// Update shelf
exports.updateShelf = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, type, visibility, rules, tags } = req.body;
    const banner = req.file;

    // Find the shelf
    const shelf = await Shelf.findById(id);
    if (!shelf) {
      return res.status(404).json({ error: "Shelf not found" });
    }

    // Check if user is an admin of the shelf
    if (!shelf.admins.includes(req.user.id)) {
      return res.status(403).json({ error: "Not authorized to update this shelf" });
    }

    // Handle banner image update
    let imageUrl = shelf.bannerImage;
    if (banner) {
      // Upload new banner
      const result = await cloudinary.uploader.upload(banner.path);
      imageUrl = result.secure_url;
      
      // TODO: You might want to delete the old image from Cloudinary
    }

    // Update shelf
    const updatedShelf = await Shelf.findByIdAndUpdate(
      id,
      {
        name,
        description,
        bannerImage: imageUrl,
        type: Array.isArray(type) ? type : [type],
        visibility,
        rules,
        tags: Array.isArray(tags) ? tags : [],
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('createdBy', 'username email')
     .populate('admins', 'username email')
     .populate('members.userId', 'username email');

    res.json(updatedShelf);
  } catch (err) {
    console.error("Error updating shelf:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete shelf
exports.deleteShelf = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the shelf
    const shelf = await Shelf.findById(id);
    if (!shelf) {
      return res.status(404).json({ error: "Shelf not found" });
    }

    // Check if user is an admin of the shelf
    if (!shelf.admins.includes(req.user.id)) {
      return res.status(403).json({ error: "Not authorized to delete this shelf" });
    }

    // TODO: You might want to delete the banner image from Cloudinary here

    await Shelf.findByIdAndDelete(id);
    res.json({ message: "Shelf deleted successfully" });
  } catch (err) {
    console.error("Error deleting shelf:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};