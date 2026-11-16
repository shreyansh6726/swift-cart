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
      const UserModel = req.clientApp === 'admin'
         ? require('../models/admin/admin')
         : req.clientApp === 'retailer'
            ? require('../models/retailer/retailer')
            : require('../models/user/user');
      const User = req.db.model(UserModel.modelName, UserModel.schema);
      const user = await User.findById(req.user.userId).select('-__v');
      res.status(200).json({ success: true, user });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
});

module.exports = router;
