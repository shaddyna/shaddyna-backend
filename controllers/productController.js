const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Product = require("../models/Product");
const Category = require("../models/Category");
const { Types } = require("mongoose");
const mongoose = require('mongoose'); 

// Set up multer for handling file uploads
const upload = multer({ dest: "uploads/" }).array("images");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Get all products
exports.getAllProducts = async (req, res) => {
    console.log("Fetching all products...");

    try {
        const products = await Product.find();
        console.log("Fetched products:", products);
        res.status(200).json({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: error.message });
    }
};

// Edit a product by its ID
exports.editProduct = async (req, res) => {
    const { productId } = req.params; // Get the productId from route params
    const { name, price, description } = req.body;

    // Check if required fields are present
    if (!name || !price || !description) {
        return res.status(400).json({ error: "Missing required fields: name, price, or description" });
    }

    try {
        // Find and update the product
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { name, price: parseFloat(price), description },
            { new: true } // Return the updated product
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        console.log("Product updated successfully:", updatedProduct);
        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: error.message });
    }
};


// Delete a product by its ID
exports.deleteProduct = async (req, res) => {
    const { productId } = req.params; // Get the productId from route params

    try {
        // Find and delete the product
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        console.log("Product deleted successfully:", deletedProduct);
        res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.createProduct = async (req, res) => {
  try {
    console.log("Received request to create product:", req.body);

    const { name, stock, price, category, attributes } = req.body;

    if (!req.files || req.files.length === 0) {
      console.error("No images uploaded.");
      return res.status(400).json({ error: "At least one image is required" });
    }

    console.log(`Received ${req.files.length} images for upload`);

    // Upload all images to Cloudinary concurrently
    const uploadPromises = req.files.map((file) =>
      new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "products" },
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

    // Save product in the database
    const product = new Product({
      name,
      stock,
      price,
      category,
      attributes: JSON.parse(attributes),
      images: uploadedImages,
    });

    console.log("Saving product to database:", product);
    await product.save();

    console.log("Product saved successfully:", product);
    res.status(201).json({ message: "Product created successfully", product });

  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching related products for product ID: ${id}`);

    // Find the current product
    const currentProduct = await Product.findById(id);
    if (!currentProduct) {
      console.log(`Product not found with ID: ${id}`);
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Current product found:", currentProduct);

    // Fetch related products based on category or similar attributes
    const relatedProducts = await Product.find({
      category: currentProduct.category,
      _id: { $ne: id }, // Exclude the current product
    }).limit(4); // Limit the number of related products

    console.log(`Found ${relatedProducts.length} related products.`);
    res.json({ relatedProducts });
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.addProduct = async (req, res) => {
  console.log("Starting to process product addition...");
  console.log("Received request with body:", req.body);
  console.log("Received files:", req.files);

  // Validate fields from body
  const { name, price, description, categoryId, sellerId, shelfId } = req.body;

  // Ensure either sellerId or shelfId is provided
  if (!name || !price || !description || !categoryId || (!sellerId && !shelfId) || !req.files || req.files.length === 0) {
    console.log("Missing required fields");
    if (!name) console.log("Missing product name");
    if (!price) console.log("Missing product price");
    if (!description) console.log("Missing product description");
    if (!categoryId) console.log("Missing product categoryId");
    if (!sellerId && !shelfId) console.log("Either sellerId or shelfId is required");
    if (!req.files) console.log("Missing file uploads");
    if (req.files && req.files.length === 0) console.log("Missing product images");
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Validate categoryId
    if (!Types.ObjectId.isValid(categoryId)) {
      console.log("Invalid categoryId format");
      return res.status(400).json({ error: "Invalid categoryId" });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      console.log("Category not found");
      return res.status(404).json({ error: "Category not found" });
    }

    // Validate sellerId or shelfId
    if (sellerId && !Types.ObjectId.isValid(sellerId)) {
      console.log("Invalid sellerId format");
      return res.status(400).json({ error: "Invalid sellerId" });
    }

    if (shelfId && !Types.ObjectId.isValid(shelfId)) {
      console.log("Invalid shelfId format");
      return res.status(400).json({ error: "Invalid shelfId" });
    }

    // Upload images to Cloudinary
    const imageUrls = await Promise.all(
      req.files.map(async (file) => {
        console.log("Uploading image to Cloudinary:", file.originalname);
        const uploadedImage = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        console.log("Uploaded image URL:", uploadedImage.secure_url);
        return uploadedImage.secure_url;
      })
    );

    // Create product in the database
    const product = await Product.create({
      name,
      price: parseFloat(price),
      description,
      categoryId,
      sellerId: sellerId || null, // Use sellerId if provided, otherwise null
      shelfId: shelfId || null,   // Use shelfId if provided, otherwise null
      images: imageUrls,
    });

    console.log("Product created successfully", product);
    res.status(201).json({ message: "Created successfully", product });
  } catch (error) {
    console.error("Error during product creation:", error);
    res.status(500).json({ error: error.message });
  }
};


{/*exports.addProduct = async (req, res) => {
  console.log("Starting to process product addition...");
  console.log("Received request with body:", req.body);
  console.log("Received files:", req.files);

  // Validate fields from body
  const { name, price, description, categoryId, sellerId } = req.body;

  // Check for missing required fields
  if (!name || !price || !description || !categoryId || !sellerId || !req.files || req.files.length === 0) {
    console.log("Missing required fields");
    if (!name) console.log("Missing product name");
    if (!price) console.log("Missing product price");
    if (!description) console.log("Missing product description");
    if (!categoryId) console.log("Missing product categoryId");
    if (!sellerId) console.log("Missing seller ID");
    if (!req.files) console.log("Missing file uploads");
    if (req.files && req.files.length === 0) console.log("Missing product images");
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Validate categoryId
    if (!Types.ObjectId.isValid(categoryId)) {
      console.log("Invalid categoryId format");
      return res.status(400).json({ error: "Invalid categoryId" });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      console.log("Category not found");
      return res.status(404).json({ error: "Category not found" });
    }

    // Validate sellerId
    if (!Types.ObjectId.isValid(sellerId)) {
      console.log("Invalid sellerId format");
      return res.status(400).json({ error: "Invalid sellerId" });
    }

    // Upload images to Cloudinary
    const imageUrls = await Promise.all(
      req.files.map(async (file) => {
        console.log("Uploading image to Cloudinary:", file.originalname);
        const uploadedImage = await cloudinary.uploader.upload(file.path, {
          folder: "products", // Folder on Cloudinary where the images will be stored
        });
        console.log("Uploaded image URL:", uploadedImage.secure_url);
        return uploadedImage.secure_url;
      })
    );

    // Create product in the database
    const product = await Product.create({
      name,
      price: parseFloat(price),
      description,
      categoryId,
      sellerId, // Include sellerId in the product creation
      images: imageUrls,
    });

    console.log("Product created successfully", product);
    res.status(201).json({ message: "Created successfully", product });
  } catch (error) {
    console.error("Error during product creation:", error);
    res.status(500).json({ error: error.message });
  }
};*/}


// Fetch a single product by its ID
exports.getProductById = async (req, res) => {
    const { productId } = req.params; // Get the productId from route params

    try {
        // Find the product by its ID
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        console.log("Fetched product:", product);
        res.status(200).json({ product });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: error.message });
    }
};

/*exports.getProductsByCategory = async (req, res) => {
    const { categoryId } = req.query;
  
    try {
      // Validate the categoryId
      if (!categoryId) {
        return res.status(400).json({ error: 'Category ID is required.' });
      }
  
      // Convert categoryId to ObjectId
      const objectIdCategoryId = mongoose.Types.ObjectId(categoryId);
  
      // Fetch products from the database
      const products = await Product.find({ categoryId: objectIdCategoryId });
  
      // If no products are found, return a 404 response
      if (products.length === 0) {
        return res.status(404).json({ message: 'No products found for this category.' });
      }
  
      // Respond with the fetched products
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      res.status(500).json({ error: 'Server error. Please try again later.' });
    }
  };*/

  exports.getProductsByCategory = async (req, res) => {
    const { categoryId } = req.query;
  
    try {
      // Validate the categoryId
      if (!categoryId) {
        return res.status(400).json({ error: 'Category ID is required.' });
      }
  
      // Convert categoryId to ObjectId
      const objectIdCategoryId = new mongoose.Types.ObjectId(categoryId); // Use `new` here
  
      // Fetch products from the database
      const products = await Product.find({ categoryId: objectIdCategoryId });
  
      // If no products are found, return a 404 response
      if (products.length === 0) {
        return res.status(404).json({ message: 'No products found for this category.' });
      }
  
      // Respond with the fetched products
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      res.status(500).json({ error: 'Server error. Please try again later.' });
    }
  };

  
exports.getProductsBySellerId = async (req, res) => {
  const { sellerId } = req.query;

  try {
    // Validate the sellerId
    if (!sellerId) {
      return res.status(400).json({ error: 'Seller ID is required.' });
    }

    // Convert sellerId to ObjectId
    const objectIdSellerId = new mongoose.Types.ObjectId(sellerId);

    // Fetch products from the database
    const products = await Product.find({ sellerId: objectIdSellerId });

    // If no products are found, return a 404 response
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this seller.' });
    }

    // Respond with the fetched products
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by seller ID:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};