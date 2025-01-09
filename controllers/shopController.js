const Shop = require("../models/Shop");
const mongoose = require('mongoose'); 

// Fetch all shops
exports.getAllShops = async (req, res) => {
    try {
      const shops = await Shop.find().populate("sellerId", "name email"); // Populate seller details
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

exports.createShop = async (req, res) => {
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
};
