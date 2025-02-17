const Startup = require('../models/Startup');

// Controller to create a new startup
const createStartup = async (req, res) => {
  try {
    const { 
        startupName,
        ideaDescription,
        estimatedValue,
        contactPhone,
        contactEmail, 
        role } = req.body;

    // Set role to 'nonstartup' if not provided
    const newStartup = new Startup({
        startupName,
        ideaDescription,
        estimatedValue,
        contactPhone,
        contactEmail,
        role: role || 'non', 
    });

    await newStartup.save();
    res.status(201).json(newStartup);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Controller to fetch all startups from the database
const getAllStartups = async (req, res) => {
  try {
    // Fetch all startups from the startup model
    const startups = await Startup.find().populate('user', 'name email'); // Optionally populate user data if needed
    
    if (!startups) {
      return res.status(404).json({ error: 'No startups found' });
    }

    res.status(200).json(startups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// Get single startup by ID
const getStartupById = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ msg: "Startup not found" });
    }
    res.status(200).json(startup);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Update a startup by ID
const updateStartup = async (req, res) => {
  try {
    const { name, email, phoneNumber, role } = req.body;
    const updatedStartup = await Startup.findByIdAndUpdate(
      req.params.id,
      { name, email, phoneNumber, role },
      { new: true }
    );

    if (!updatedStartup) {
      return res.status(404).json({ msg: "startup not found" });
    }
    res.status(200).json(updatedStartup);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Delete a startup by ID
const deleteStartup = async (req, res) => {
  try {
    const startup = await Startup.findByIdAndDelete(req.params.id);
    if (!startup) {
      return res.status(404).json({ msg: "Startup not found" });
    }
    res.status(200).json({ msg: "Startup deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createStartup,
  getAllStartups,
  getStartupById,
  updateStartup,
  deleteStartup,
};