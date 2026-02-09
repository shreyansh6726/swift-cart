const Retailer = require('../models/Retailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerRetailer = async (req, res) => {
  try {
    const { shopName, ownerName, age, gender, email, password, phone, address, retailerId } = req.body;

    const exists = await Retailer.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Retailer already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const retailer = await Retailer.create({
      shopName,
      ownerName,
      age: Number(age),
      gender,
      email,
      password: hashedPassword,
      phone,
      address,
      retailerId: Number(retailerId) // Ensure ID is a number if required by schema
    });

    const token = jwt.sign(
      { id: retailer._id },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      _id: retailer._id,
      shopName: retailer.shopName,
      token: token,
      message: "Retailer registered successfully"
    });
  } catch (error) {
    console.error("Detailed Retailer Error:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
      details: error.errors
    });
  }
};

// Login remains the same...
exports.loginRetailer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const retailer = await Retailer.findOne({ email });
    if (retailer && (await bcrypt.compare(password, retailer.password))) {
      const token = jwt.sign({ id: retailer._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '30d' });
      res.json({ _id: retailer._id, shopName: retailer.shopName, email: retailer.email, token: token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { shopName, ownerName, age, phone, address } = req.body;
    const retailerId = req.user.id; // From auth middleware

    const retailer = await Retailer.findById(retailerId);
    if (!retailer) {
      return res.status(404).json({ message: 'Retailer not found' });
    }

    if (shopName) retailer.shopName = shopName;
    if (ownerName) retailer.ownerName = ownerName;
    if (age) retailer.age = Number(age);
    if (phone) retailer.phone = phone;
    if (address) retailer.address = address;

    const updatedRetailer = await retailer.save();

    res.json({
      _id: updatedRetailer._id,
      shopName: updatedRetailer.shopName,
      ownerName: updatedRetailer.ownerName,
      email: updatedRetailer.email,
      phone: updatedRetailer.phone,
      address: updatedRetailer.address,
      age: updatedRetailer.age,
      message: "Profile updated successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};