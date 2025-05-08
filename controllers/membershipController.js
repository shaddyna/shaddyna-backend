// controllers/membershipController.js
const MembershipRequest = require('../models/memberRequest');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Create a membership request
// @route   POST /api/membership
// @access  Private
exports.createMembershipRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { mpesaName, mpesaCode } = req.body;
    const amount = 500; // Fixed amount

    // Check if user already has a pending request
    const existingRequest = await MembershipRequest.findOne({
      user: req.user.id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ 
        error: 'You already have a pending membership request' 
      });
    }

    // Check if user is already a member
    const user = await User.findById(req.user.id);
    if (user.member) {
      return res.status(400).json({ 
        error: 'You are already a member' 
      });
    }

    const membershipRequest = new MembershipRequest({
      user: req.user.id,
      mpesaName,
      mpesaCode,
      amount
    });

    await membershipRequest.save();

    res.status(201).json(membershipRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get all membership requests (for admin)
// @route   GET /api/membership
// @access  Private/Admin
exports.getMembershipRequests = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const requests = await MembershipRequest.find(query)
      .populate('user', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get current user's membership request
// @route   GET /api/membership/me
// @access  Private
exports.getMyMembershipRequest = async (req, res) => {
  try {
    const request = await MembershipRequest.findOne({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('reviewedBy', 'firstName lastName');

    if (!request) {
      return res.status(404).json({ error: 'No membership request found' });
    }

    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Approve a membership request
// @route   PUT /api/membership/:id/approve
// @access  Private/Admin
exports.approveMembershipRequest = async (req, res) => {
  try {
    const request = await MembershipRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ 
        error: 'Request has already been processed' 
      });
    }

    // Update the request
    request.status = 'approved';
    request.reviewedBy = req.user.id;
    request.reviewedAt = new Date();
    await request.save();

    // Update the user's member status
    await User.findByIdAndUpdate(request.user, { 
      member: true 
    });

    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Reject a membership request
// @route   PUT /api/membership/:id/reject
// @access  Private/Admin
exports.rejectMembershipRequest = async (req, res) => {
  try {
    const { notes } = req.body;
    const request = await MembershipRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ 
        error: 'Request has already been processed' 
      });
    }

    // Update the request
    request.status = 'rejected';
    request.reviewedBy = req.user.id;
    request.reviewedAt = new Date();
    request.notes = notes;
    await request.save();

    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};