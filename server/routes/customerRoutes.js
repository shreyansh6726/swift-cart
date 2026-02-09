const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { registerCustomer, loginCustomer, updateProfile } = require('../controllers/customerController');
const { addToCart, removeFromCart, getCart, updateCartItemQuantity } = require('../controllers/cartController');

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.put('/profile', protect, updateProfile);

// Cart Routes
router.post('/cart/add', protect, addToCart);
router.post('/cart/remove', protect, removeFromCart); // For removing item completely
router.post('/cart/update-quantity', protect, updateCartItemQuantity); // For +/-
router.get('/cart', protect, getCart);

module.exports = router;