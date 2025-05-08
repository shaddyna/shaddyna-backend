const express = require('express');
const router = express.Router();
const {
  createMembershipRequest,
  getMembershipRequests,
  getMyMembershipRequest,
  approveMembershipRequest,
  rejectMembershipRequest
} = require('../controllers/membershipController');
const  protect = require('../middleware/authMiddleware');

router.post('/membership',protect, createMembershipRequest);
router.get('/', protect, getMembershipRequests);
router.get('/me', protect, getMyMembershipRequest);
router.put('/:id/approve', protect, approveMembershipRequest);
router.put('/:id/reject', protect, rejectMembershipRequest);

module.exports = router;
