const Skill = require('../models/Skill');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const mongoose = require('mongoose');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadToCloudinary = (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: `${Date.now()}_${fileName.split('.')[0]}`, // Add timestamp and remove extension
        folder: 'skills',
        resource_type: 'auto',
        quality: 'auto:good' // Optimize image quality
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          return reject(error);
        }
        console.log('Upload successful:', result.secure_url);
        resolve(result.secure_url);
      }
    );

    // Convert buffer to stream
    const bufferStream = new Readable();
    bufferStream.push(fileBuffer);
    bufferStream.push(null); // Signals end of stream
    bufferStream.pipe(uploadStream);
  });
};

const uploadMultipleToCloudinary = async (files) => {
  try {
    console.log('Received files for upload:', files.map(f => f.originalname));
    
    const uploadPromises = files.map(file => 
      uploadToCloudinary(file.buffer, file.originalname)
    );

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Cloudinary multiple upload error:', error);
    throw new Error('Failed to upload images to Cloudinary');
  }
};
exports.createSkill = async (req, res) => {
  try {
    console.log('==== REQUEST BODY ====');
    console.log(JSON.stringify(req.body, null, 2));
    console.log('==== FILES RECEIVED ====');
    console.log(req.files.map(f => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      size: f.size
    })));

    // Group files by field names
    const filesMap = {};
    req.files.forEach(file => {
      filesMap[file.fieldname] = file;
    });

    // Validate required fields
    const { name, level, rating, description, price, portfolio } = req.body;
    if (!name || !level || !rating || !description || !price) {
      return res.status(400).json({ 
        error: 'All text fields are required.' 
      });
    }

    // Validate main images
    if (!filesMap['image'] || !filesMap['pimage']) {
      return res.status(400).json({ 
        error: 'Both main image and profile image are required.' 
      });
    }

    // Upload main images
    const [imageUrl, pimageUrl] = await uploadMultipleToCloudinary([
      filesMap['image'],
      filesMap['pimage']
    ]);

    // Process portfolio items - NEW FIXED VERSION
    const portfolioItems = [];
    
    if (portfolio && Array.isArray(portfolio)) {
      console.log('Processing portfolio array:', portfolio);
      
      for (let i = 0; i < portfolio.length; i++) {
        const item = portfolio[i];
        const imageKey = `portfolio[${i}][image]`;
        const portfolioFile = filesMap[imageKey];

        console.log(`Processing portfolio item ${i}:`, {
          title: item.title,
          description: item.description,
          hasImage: !!portfolioFile
        });

        if (!item.title || !item.description || !portfolioFile) {
          return res.status(400).json({ 
            error: `Portfolio item ${i + 1} must include title, description, and image.` 
          });
        }

        const portfolioImageUrl = await uploadToCloudinary(
          portfolioFile.buffer, 
          `portfolio_${i}_${Date.now()}_${portfolioFile.originalname}`
        );

        portfolioItems.push({ 
          title: item.title, 
          description: item.description, 
          image: portfolioImageUrl 
        });
      }
    }

    console.log('Final portfolio items:', portfolioItems);

    // Create and save the new skill
    const newSkill = new Skill({
      name: name.trim(),
      level: parseInt(level),
      rating: parseFloat(rating),
      description: description.trim(),
      price: parseFloat(price),
      image: imageUrl,
      pimage: pimageUrl,
      portfolio: portfolioItems,
      createdAt: new Date()
    });

    const savedSkill = await newSkill.save();
    console.log('Skill saved successfully:', savedSkill);

    return res.status(201).json({
      success: true,
      data: savedSkill
    });

  } catch (error) {
    console.error('Error creating skill:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while creating skill.'
    });
  }
};


// GET ALL SKILLS
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching skills'
    });
  }
};

// GET SINGLE SKILL
exports.getSkillById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid skill ID format'
      });
    }

    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found'
      });
    }

    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    console.error('Error fetching skill:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching skill'
    });
  }
};