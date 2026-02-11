const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerCustomer = async (req, res) => {
  try {
    const { name, age, gender, email, password, phone, address } = req.body;

    const userExists = await Customer.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customer = await Customer.create({
      name,
      age: Number(age),
      gender,
      email,
      password: hashedPassword,
      phone,
      address,
      cart: null
    });

    const token = jwt.sign(
      { id: customer._id },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      token: token,
      message: "Registration successful!"
    });
  } catch (error) {
    console.error("Detailed Registration Error:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
      details: error.errors
    });
  }
};

exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email });
    if (customer && (await bcrypt.compare(password, customer.password))) {
      const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '30d' });
      res.json({ _id: customer._id, name: customer.name, email: customer.email, token: token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, age, phone, address } = req.body;
    const customerId = req.user._id; // From auth middleware

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (name) customer.name = name;
    if (age) customer.age = Number(age);
    if (phone) customer.phone = phone;
    if (address) customer.address = address;

    const updatedCustomer = await customer.save();

    res.json({
      _id: updatedCustomer._id,
      name: updatedCustomer.name,
      email: updatedCustomer.email,
      phone: updatedCustomer.phone,
      address: updatedCustomer.address,
      age: updatedCustomer.age,
      message: "Profile updated successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};