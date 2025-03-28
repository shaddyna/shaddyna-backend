const Shop = require("../models/Shop");
const mongoose = require('mongoose'); 
const cloudinary = require("cloudinary").v2;

// Fetch all shops
exports.getAllShops = async (req, res) => {
    try {
      //const shops = await Shop.find().populate("sellerId", "name email");
      const shops = await Shop.find().populate("name email"); // Populate seller details
      res.status(200).json({ message: "Shops fetched successfully", shops });
    } catch (error) {
      console.error("Error fetching shops:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };
  
  
// Controller function to get shop details by id
exports.getShopById = async (req, res) => {
    const { id } = req.params;
  
    console.log(`Received request to fetch shop with ID: ${id}`); // Log the incoming ID
  
    // Check if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`Invalid shop ID: ${id}`); // Log invalid ID
      return res.status(400).json({ error: 'Invalid shop ID' });
    }
  
    try {
      console.log(`Querying the database for shop with ID: ${id}`); // Log before querying the database
      const shop = await Shop.findById(id).populate('sellerId');
  
      if (!shop) {
        console.log(`Shop with ID: ${id} not found`); // Log if shop is not found
        return res.status(404).json({ error: 'Shop not found' });
      }
  
      console.log(`Shop with ID: ${id} found successfully`); // Log successful shop retrieval
      res.json({ shop });
  
    } catch (err) {
      console.error(`Error fetching shop with ID: ${id} -`, err); // Log the error with the ID
      res.status(500).json({ error: 'Server error' });
    }
  };

/*exports.createShop = async (req, res) => {
  const { name, location, description, email, contact, instagram, facebook, twitter, sellerId } = req.body;

  try {
    const newShop = new Shop({
      name,
      location,
      description,
      email,
      contact,
      instagram,
      facebook,
      twitter,
      sellerId,
    });

    await newShop.save();
    res.status(201).json({ message: "Shop created successfully", shop: newShop });
  } catch (error) {
    console.error("Error creating shop:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};*/

// Backend: Controller



cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


/*exports.createShop = async (req, res) => {
  console.log("Incoming request body:", req.body);
  console.log("Incoming file:", req.file); // Logs the file object from multer

  if (!req.file) {
    console.log("No file uploaded");
  }

  const { name, location, description, email, contact, instagram, facebook, twitter, sellerId } = req.body;

  try {
    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      console.log("Uploaded image URL:", imageUrl);
    }

    const newShop = new Shop({
      name,
      location,
      description,
      email,
      contact,
      instagram,
      facebook,
      twitter,
      sellerId,
      image: imageUrl,
    });

    await newShop.save();
    res.status(201).json({ message: "Shop created successfully", shop: newShop });
  } catch (error) {
    console.error("Error creating shop:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
*/


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.createShop = async (req, res) => {
  try {
    console.log("Received request to create shop:", req.body);

    const { 
      name, 
      description, 
      phoneNumber, 
      openingHours, 
      closingHours, 
      email, 
      location, 
      category, 
      attributes,
      socialMedias
    } = req.body;

  // Basic validation
if (!name || !description || !phoneNumber || !email || !location || !category) {
  console.error("Missing required fields:", {
    name,
    description,
    phoneNumber,
    email,
    location,
    category
  });

  return res.status(400).json({ error: "Please fill all required fields" });
}

if (!req.files || req.files.length === 0) {
  console.error("No images uploaded");
  return res.status(400).json({ error: "At least one image is required" });
}


    console.log(`Received ${req.files.length} images for upload`);

    // Upload all images to Cloudinary concurrently
    const uploadPromises = req.files.map((file) =>
      new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "shops" }, // Changed folder name to "shops"
          (error, uploadResult) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              console.log("Image uploaded successfully:", uploadResult.secure_url);
              resolve(uploadResult.secure_url);
            }
          }
        );
        uploadStream.end(file.buffer);
      })
    );

    // Wait for all uploads to complete
    const uploadedImages = await Promise.all(uploadPromises);

    console.log("All images uploaded successfully:", uploadedImages);

    // Create new shop
    const shop = new Shop({
      name,
      description,
      phoneNumber,
      openingHours: openingHours || "09:00",
      closingHours: closingHours || "18:00",
      email,
      location,
      category,
      attributes: JSON.parse(attributes),
      socialMedias: JSON.parse(socialMedias) || [],
      images: uploadedImages,
      //owner: req.user._id // Assuming you have user authentication
    });

    await shop.save();

    console.log("Shop created successfully:", shop);
    res.status(201).json({ 
      message: "Shop created successfully", 
      shop: {
        _id: shop._id,
        name: shop.name,
        description: shop.description,
        category: shop.category,
        images: shop.images,
        // Include other fields you want to return
      }
    });

  } catch (error) {
    console.error("Error creating shop:", error);
    res.status(500).json({ 
      error: error.message || "An error occurred while creating the shop" 
    });
  }
};

// Other controller methods remain the same...