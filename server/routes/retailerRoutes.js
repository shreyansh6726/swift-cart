const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { registerRetailer, loginRetailer, updateProfile } = require('../controllers/retailerController');

router.post('/register', registerRetailer);
router.post('/login', loginRetailer);
router.put('/profile', protect, updateProfile);

module.exports = router;