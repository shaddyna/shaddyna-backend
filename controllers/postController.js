const Post = require('../models/Post');
const Shelf = require('../models/Shelf');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { shelfId, type, images, ...postData } = req.body;
    delete postData.type;

    // 🔥 Log incoming request body
    console.log('Incoming Post Request Body:', req.body);
    console.log('Extracted shelfId:', shelfId);
    console.log('Extracted type:', type);
    console.log('Extracted images:', images);
    console.log('Other postData:', postData);

    // Validate type
    const allowedTypes = ["product", "service", "investment"];
    let correctType;
    
    if (Array.isArray(type)) {
      correctType = type.find(t => allowedTypes.includes(t));
    } else {
      correctType = type;
    }

    if (!correctType || !allowedTypes.includes(correctType)) {
      console.log('Invalid type provided:', type); // 🔥 Add this too
      return res.status(400).json({ message: 'Invalid type provided' });
    }

    // Find the shelf
    const shelf = await Shelf.findById(shelfId);
    if (!shelf) {
      console.log('Shelf not found with ID:', shelfId); // 🔥
      return res.status(404).json({ message: 'Shelf not found' });
    }

    // Check user authorization
    const isMember = shelf.members.some(member => 
      member.userId.toString() === req.user.id.toString()
    );
    const isAdmin = shelf.admins.some(admin => 
      admin.toString() === req.user.id.toString()
    );
    const isCreator = shelf.createdBy.toString() === req.user.id.toString();

    if (!isMember && !isAdmin && !isCreator) {
      console.log('Unauthorized user:', req.user.id); // 🔥
      return res.status(403).json({ message: 'Not authorized to create post in this shelf' });
    }

    // Create post
    const post = new Post({
      ...postData,
      type: correctType,
      shelf: shelfId,
      createdBy: req.user.id,
      images: images.map(url => ({
        url,
        publicId: url.split('/').pop().split('.')[0]
      })),
      [correctType]: postData[correctType]
    });

    console.log('New Post Object:', post); // 🔥 Before saving

    await post.save();

    // Add post to shelf
    shelf.posts.push(post._id);
    //await shelf.save();

    await Shelf.findByIdAndUpdate(
      shelfId,
      { $push: { posts: post._id } },
      { new: true }
    );
    

    res.status(201).json(post);
  } catch (error) {
    console.error('Server Error:', error); // 🔥
    res.status(500).json({ message: 'Server Error' });
  }
};



// Get posts by shelf
exports.getPostsByShelf = async (req, res) => {
  try {
    const { shelfId } = req.params;
    
    const posts = await Post.find({ shelf: shelfId })
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get single post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('createdBy', 'name email avatar')
      .populate('shelf', 'name bannerImage');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the creator or shelf admin
    if (post.createdBy.toString() !== req.user.id) {
      const shelf = await Shelf.findById(post.shelf);
      const isAdmin = shelf.admins.some(admin => admin.toString() === req.user.id);
      
      if (!isAdmin) {
        return res.status(403).json({ message: 'Not authorized to update this post' });
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the creator or shelf admin
    if (post.createdBy.toString() !== req.user.id) {
      const shelf = await Shelf.findById(post.shelf);
      const isAdmin = shelf.admins.some(admin => admin.toString() === req.user.id);
      
      if (!isAdmin) {
        return res.status(403).json({ message: 'Not authorized to delete this post' });
      }
    }

    await Post.findByIdAndDelete(id);

    // Remove post reference from shelf
    await Shelf.updateOne(
      { _id: post.shelf },
      { $pull: { posts: post._id } }
    );

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};