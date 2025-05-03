// controllers/sellerRequestController.js
const SellerRequest = require('../models/SellerRequest');
const User = require('../models/User');
const Seller = require('../models/Seller');

// Create membership request (already exists)
exports.createMembershipRequest = async (req, res) => {
  try {
    const { mpesaName, mpesaCode } = req.body;
    const amount = 500; // Static amount in KES

    const existingRequest = await SellerRequest.findOne({ 
      userId: req.user.id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ 
        error: 'You already have a pending membership request' 
      });
    }

    const sellerRequest = new SellerRequest({
      userId: req.user.id,
      mpesaName,
      mpesaCode,
      amount,
      paymentMethod: 'mpesa'
    });

    await sellerRequest.save();

    res.status(201).json({
      message: 'Membership request submitted successfully',
      request: sellerRequest
    });
  } catch (error) {
    console.error('Error creating membership request:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all seller requests (admin only)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await SellerRequest.find()
      .populate('userId', 'firstName lastName email')
      .populate('processedBy', 'firstName lastName email')
      .sort('-createdAt');

    res.json(requests);
  } catch (error) {
    console.error('Error fetching seller requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single seller request
exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await SellerRequest.findById(id)
      .populate('userId', 'firstName lastName email')
      .populate('processedBy', 'firstName lastName email');

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update seller request (admin or user)
/*exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedRequest = await SellerRequest.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json({
      message: 'Request updated successfully',
      request: updatedRequest
    });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Server error' });
  }
};*/
// Update seller request (admin or user)
exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Fetch the request with the user populated
    const request = await SellerRequest.findById(id).populate('userId');

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Update request status, processedBy, and processedAt
    request.status = status;
    //request.processedBy = req.user.id;
    request.processedAt = new Date();

    await request.save();

    // If approved, update user role & add seller
  // If approved, update user role & add seller
if (status === 'approved') {
  const user = await User.findById(request.userId._id);

  if (user) {
    user.role = 'seller';
    await user.save();

    const existingSeller = await Seller.findOne({ email: user.email });

    if (!existingSeller) {
      await Seller.create({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        mpesaCode: request.mpesaCode,
        amount: request.amount,
        status: 'active'
      });
    }
  }
}


    res.json({
      message: 'Request updated successfully',
      request
    });

  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Delete seller request
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRequest = await SellerRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Check for pending request
exports.checkPendingRequest = async (req, res) => {
  try {
    const existingRequest = await SellerRequest.findOne({ 
      userId: req.user.id,
      status: 'pending'
    });

    res.json({ 
      hasPendingRequest: !!existingRequest,
      request: existingRequest || null
    });
  } catch (error) {
    console.error('Error checking pending request:', error);
    res.status(500).json({ error: 'Server error' });
  }
};