const Skill = require("../models/Skill");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


exports.createSkill = async (req, res) => {
  console.log("Incoming request body:", req.body);
  console.log("Incoming file:", req.file); // Logs the file object from multer

  if (!req.file) {
    console.log("No file uploaded");
  }

  const { name, service, description, level, price, contact } = req.body;

  try {
    let cimageUrl = "";

    let pimageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      cimageUrl = result.secure_url;
      console.log("Uploaded image URL:", cimageUrl);
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      pimageUrl = result.secure_url;
      console.log("Uploaded image URL:", pimageUrl);
    }

    const newSkill = new Skill({
      name,
      service,
      description,
      level,
      contact,
      price,
      cimage: cimageUrl,
      pimage: pimageUrl,
    });

    await newSkill.save();
    res.status(201).json({ message: "Skill created successfully", skill: newSkill });
  } catch (error) {
    console.error("Error creating Skill:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};