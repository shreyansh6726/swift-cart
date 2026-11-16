const User = require('../models/user/user');
const UserCredential = require('../models/user/userCredential');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER CONTROLLER
exports.register = async (req, res) => {
   try {
      const { name, email, phone_number, gender, dob, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(400).json({ success: false, message: 'Email is already registered' });
      }

      // Create the user profile
      const user = new User({
         name,
         email,
         phone_number,
         gender,
         dob
      });
      await user.save();

      // Hash the password securely
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create the user credentials record linked to the user
      const credential = new UserCredential({
         user_id: user._id,
         password: hashedPassword
      });
      await credential.save();

      res.status(201).json({
         success: true,
         message: 'User registered successfully',
         userId: user._id
      });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
};

// 2. LOGIN CONTROLLER
exports.login = async (req, res) => {
   try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Find corresponding password credential
      const credential = await UserCredential.findOne({ user_id: user._id });
      if (!credential) {
         return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Compare submitted password with hashed password
      const isMatch = await bcrypt.compare(password, credential.password);
      if (!isMatch) {
         return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Generate JWT Token (expires in 7 days)
      const token = jwt.sign(
         { userId: user._id, email: user.email },
         process.env.JWT_SECRET || 'your_super_secret_key_here',
         { expiresIn: '7d' }
      );

      res.status(200).json({
         success: true,
         message: 'Login successful',
         token,
         user: {
            id: user._id,
            name: user.name,
            email: user.email
         }
      });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
};