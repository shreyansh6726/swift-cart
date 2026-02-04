const Retailer = require('../models/Retailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Retailer
exports.registerRetailer = async (req, res) => {
  try {
    const { shopName, ownerName, age, gender, email, password, phone, address, retailerId } = req.body;
    
    const exists = await Retailer.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Retailer already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const retailer = await Retailer.create({
      shopName, ownerName, age, gender, email, 
      password: hashedPassword, phone, address, retailerId
    });

    res.status(201).json({ message: "Retailer registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Retailer
exports.loginRetailer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const retailer = await Retailer.findOne({ email });

    if (retailer && (await bcrypt.compare(password, retailer.password))) {
      const token = jwt.sign({ id: retailer._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      res.json({
        _id: retailer._id,
        shopName: retailer.shopName,
        token: token
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};