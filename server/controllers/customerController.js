const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new customer
// @route   POST /api/customers/register
exports.registerCustomer = async (req, res) => {
  try {
    const { name, age, gender, email, password, phone, address } = req.body;

    // 1. Check if user already exists
    const userExists = await Customer.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the customer (Cart is null by default from our Model)
    const customer = await Customer.create({
      name,
      age,
      gender,
      email,
      password: hashedPassword,
      phone,
      address,
      cart: null // Explicitly ensuring it starts as null
    });

    if (customer) {
      res.status(201).json({
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        message: "Registration successful!"
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login customer & get token
// @route   POST /api/customers/login
exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const customer = await Customer.findOne({ email });

    // 2. Check if user exists and password matches
    if (customer && (await bcrypt.compare(password, customer.password))) {
      
      // 3. Generate a JWT Token
      const token = jwt.sign(
        { id: customer._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '30d' } // Token stays valid for 30 days
      );

      res.json({
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        token: token, // Send this to React
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};