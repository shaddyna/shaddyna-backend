
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Shelf = require("../models/Shelf");
const fs = require("fs");
//const Shelf = require("../models/Shelf");
const User = require("../models/User");

// Multer setup
const upload = multer({ dest: "uploads/" });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Upload file to Cloudinary
const uploadToCloudinary = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    fs.unlinkSync(filePath); // Delete local file after upload
    return result.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
};

// ✅ Create Shelf
/*exports.createShelf = [
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "memberImages", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      console.log("📝 Received body:", req.body);
      console.log("🖼️ Received files:", req.files);

      const { name, description, price } = req.body;
      let members = typeof req.body.members === "string" ? JSON.parse(req.body.members) : req.body.members || [];

      // Upload shelf image
      const shelfImageUrl = req.files.image?.length > 0 ? await uploadToCloudinary(req.files.image[0].path, "shelves") : "";

      // Upload member images
      const uploadedMembers = await Promise.all(
        members.map(async (member, index) => {
          const memberImageUrl = req.files.memberImages?.[index] ? await uploadToCloudinary(req.files.memberImages[index].path, "members") : "";
          return { ...member, image: memberImageUrl };
        })
      );

      // Save shelf
      const newShelf = new Shelf({ name, description, image: shelfImageUrl, price, members: uploadedMembers });
      const savedShelf = await newShelf.save();

      console.log("✅ Shelf saved successfully:", savedShelf);
      res.status(201).json(savedShelf);
    } catch (error) {
      console.error("❌ Error creating shelf:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];*/

// ✅ Get All Shelves
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

// ✅ Update Shelf
exports.updateShelf = [
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "memberImages", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      console.log("🔄 Updating shelf with ID:", req.params.id);
      const { name, description, price } = req.body;
      let members = typeof req.body.members === "string" ? JSON.parse(req.body.members) : req.body.members || [];

      const shelf = await Shelf.findById(req.params.id);
      if (!shelf) return res.status(404).json({ message: "Shelf not found" });

      // Upload new shelf image if provided
      if (req.files.image?.length > 0) {
        shelf.image = await uploadToCloudinary(req.files.image[0].path, "shelves");
      }

      // Upload new member images
      const updatedMembers = await Promise.all(
        members.map(async (member, index) => {
          const memberImageUrl = req.files.memberImages?.[index] ? await uploadToCloudinary(req.files.memberImages[index].path, "members") : member.image;
          return { ...member, image: memberImageUrl };
        })
      );

      // Update shelf details
      shelf.name = name || shelf.name;
      shelf.description = description || shelf.description;
      shelf.price = price || shelf.price;
      shelf.members = updatedMembers;

      const updatedShelf = await shelf.save();
      console.log("✅ Shelf updated successfully:", updatedShelf);
      res.status(200).json(updatedShelf);
    } catch (error) {
      console.error("❌ Error updating shelf:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];

// ✅ Delete Shelf
exports.deleteShelf = async (req, res) => {
  try {
    const shelf = await Shelf.findByIdAndDelete(req.params.id);
    if (!shelf) return res.status(404).json({ message: "Shelf not found" });

    console.log("🗑️ Shelf deleted:", shelf);
    res.status(200).json({ message: "Shelf deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting shelf:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};





// Create a new shelf
exports.createShelf = async (req, res) => {
  try {
    const { name, description, type, openForMembers, members } = req.body;

    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({ 
        success: false,
        message: "Name and description are required" 
      });
    }

    // Validate members exist
    const memberIds = members.map(m => m.userId);
    const existingUsers = await User.find({ _id: { $in: memberIds } });
    
    if (existingUsers.length !== memberIds.length) {
      return res.status(400).json({ 
        success: false,
        message: "One or more members do not exist" 
      });
    }

    // Create the shelf
    const shelf = new Shelf({
      name,
      description,
      type: type || 'product',
      openForMembers: openForMembers !== false, // default to true
      members,
      products: [],
      investments: 0
    });

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

// Get all shelves
/*exports.getShelves = async (req, res) => {
  try {
    const shelves = await Shelf.find()
      .populate('members.userId', 'firstName email image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: shelves
    });
  } catch (error) {
    console.error("Error fetching shelves:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error while fetching shelves",
      error: error.message 
    });
  }
};*/