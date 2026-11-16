const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected Route Example
router.get('/profile', verifyToken, async (req, res) => {
   try {
      const User = require('../models/user');
      const user = await User.findById(req.user.userId).select('-__v');
      res.status(200).json({ success: true, user });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
});

module.exports = router;