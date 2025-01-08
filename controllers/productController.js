const productModel = require('../models/Product');
const mongoose = require('mongoose'); 

// Get all products
exports.getAllProducts = async (req, res) => {
    console.log("Fetching all products...");

    try {
        const products = await productModel.find();
        console.log("Fetched products:", products);
        res.status(200).json({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: error.message });
    }
};

// Edit a product by its ID
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
        const updatedProduct = await productModel.findByIdAndUpdate(
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
        const deletedProduct = await productModel.findByIdAndDelete(productId);

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


exports.addProduct = async (req, res) => {
    console.log("Starting to process product addition...");
    
    const { name, price, description } = req.body;

    // Check if required fields are present
    if (!name || !price || !description) {
        return res.status(400).json({ error: "Missing required fields: name, price, or description" });
    }

    try {
        // Save product to the database
        const prod = await productModel.create({
            name,
            price: parseFloat(price),
            description,
        });

        console.log("Product created successfully in the database:", prod);
        res.status(201).json({ message: "Created successfully", product: prod });
    } catch (error) {
        console.error("Error during product creation:", error);
        res.status(500).json({ error: error.message });
    }
};

// Fetch a single product by its ID
exports.getProductById = async (req, res) => {
    const { productId } = req.params; // Get the productId from route params

    try {
        // Find the product by its ID
        const product = await productModel.findById(productId);

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

