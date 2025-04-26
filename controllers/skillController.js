/*const Skill = require('../models/Skill');
const cloudinary = require('cloudinary').v2;
const User = require('../models/User');
const streamifier = require('streamifier'); // Add this package to handle buffer streams

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'skills' },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

exports.createSkill = async (req, res) => {
  try {
    // Get user data
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Upload images to Cloudinary from memory
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file);
        imageUrls.push(result.secure_url);
      }
    }

    // Create skill
    const skillData = {
      ...req.body,
      images: imageUrls,
      createdBy: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        skills: user.skills,
        joinedAt: user.createdAt
      }
    };

    // Convert tags from string to array if needed
    if (typeof skillData.tags === 'string') {
      skillData.tags = skillData.tags.split(',').map(tag => tag.trim());
    }

    const skill = new Skill(skillData);
    await skill.save();

    res.status(201).json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};*/

const Skill = require('../models/Skill');
const cloudinary = require('cloudinary').v2;
const User = require('../models/User');
const streamifier = require('streamifier');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'skills' },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

// Helper function to delete images from Cloudinary
const deleteFromCloudinary = async (url) => {
  try {
    const publicId = url.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`skills/${publicId}`);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};

// Create Skill
exports.createSkill = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file);
        imageUrls.push(result.secure_url);
      }
    }

    const skillData = {
      ...req.body,
      images: imageUrls,
      createdBy: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        skills: user.skills,
        joinedAt: user.createdAt
      }
    };

    if (typeof skillData.tags === 'string') {
      skillData.tags = skillData.tags.split(',').map(tag => tag.trim());
    }

    const skill = new Skill(skillData);
    await skill.save();

    res.status(201).json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Get All Skills
exports.getAllSkills = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtering
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.userId) {
      filter['createdBy.id'] = req.query.userId;
    }
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Sorting
    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default: newest first
    }

    const skills = await Skill.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Skill.countDocuments(filter);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      skills
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

const mongoose = require('mongoose');

// Get Single Skill
exports.getSkill = async (req, res) => {
  try {
    // Increment view count
    await Skill.findByIdAndUpdate(req.params.id, { $inc: { 'stats.views': 1 } });

    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};
////////////////////////////////////////////////////////
// Update Skill
exports.updateSkill = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // Check if the user is the creator of the skill
    if (skill.createdBy.id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this skill' });
    }

    // Handle new image uploads
    const newImageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file);
        newImageUrls.push(result.secure_url);
      }
    }

    // Handle image deletions
    if (req.body.deletedImages) {
      const deletedImages = Array.isArray(req.body.deletedImages) 
        ? req.body.deletedImages 
        : [req.body.deletedImages];
      
      for (const imgUrl of deletedImages) {
        await deleteFromCloudinary(imgUrl);
      }
    }

    // Prepare update data
    const updateData = {
      ...req.body,
      images: [
        ...(skill.images.filter(img => !req.body.deletedImages?.includes(img)) || []),
        ...newImageUrls
      ]
    };

    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim());
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedSkill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Delete Skill
exports.deleteSkill = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // Check if the user is the creator of the skill
    if (skill.createdBy.id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this skill' });
    }

    // Delete images from Cloudinary
    if (skill.images && skill.images.length > 0) {
      for (const imgUrl of skill.images) {
        await deleteFromCloudinary(imgUrl);
      }
    }

    await Skill.findByIdAndDelete(req.params.id);

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Like/Unlike Skill
exports.toggleLike = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    const userId = req.user.id;
    const likeIndex = skill.likes.indexOf(userId);

    if (likeIndex === -1) {
      // Like the skill
      skill.likes.push(userId);
    } else {
      // Unlike the skill
      skill.likes.splice(likeIndex, 1);
    }

    await skill.save();

    res.json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name avatar'); // Ensure name and avatar are selected
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const comment = {
      content,
      author: {
        id: user._id,
        name: user.name,
        avatar: user.avatar
      }
    };

    skill.comments.push(comment);
    await skill.save();

    res.status(201).json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Add comment to skill
/*exports.addComment = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    const comment = {
      content: req.body.content,
      author: {
        id: user._id,
        name: user.name,
        avatar: user.avatar
      }
    };

    skill.comments.push(comment);
    await skill.save();

    res.status(201).json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};*/

// Delete comment from skill
exports.deleteComment = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    const commentIndex = skill.comments.findIndex(
      comment => comment._id.toString() === req.params.commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the user is the author of the comment or the skill owner
    const comment = skill.comments[commentIndex];
    if (comment.author.id.toString() !== req.user.id && 
        skill.createdBy.id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    skill.comments.splice(commentIndex, 1);
    await skill.save();

    res.json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Add reply to comment
exports.addReply = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    const comment = skill.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const reply = {
      content: req.body.content,
      author: {
        id: user._id,
        name: user.name,
        avatar: user.avatar
      }
    };

    comment.replies.push(reply);
    await skill.save();

    res.status(201).json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Delete reply from comment
exports.deleteReply = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    const comment = skill.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const replyIndex = comment.replies.findIndex(
      reply => reply._id.toString() === req.params.replyId
    );

    if (replyIndex === -1) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    // Check if the user is the author of the reply or the skill owner
    const reply = comment.replies[replyIndex];
    if (reply.author.id.toString() !== req.user.id && 
        skill.createdBy.id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this reply' });
    }

    comment.replies.splice(replyIndex, 1);
    await skill.save();

    res.json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};