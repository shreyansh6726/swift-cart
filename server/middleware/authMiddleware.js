const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Retailer = require('../models/Retailer');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');

      // Try finding in both collections
      let user = await Customer.findById(decoded.id).select('-password');
      let role = 'customer';

      if (!user) {
        user = await Retailer.findById(decoded.id).select('-password');
        role = 'retailer';
      }

      if (!user) return res.status(401).json({ success: false, message: 'User not found' });

      // FIX: Convert to plain object to ensure 'role' stays attached
      req.user = user.toObject(); 
      req.user.role = role;
      
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ success: false, message: 'No token provided' });
  }
};

const retailerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'retailer') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Retailers only' });
  }
};

module.exports = { protect, retailerOnly };