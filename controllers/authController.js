const User = require('../models/user/user');
const Admin = require('../models/admin/admin');
const Retailer = require('../models/retailer/retailer');
const UserCredential = require('../models/user/userCredential');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getModels = (connection, clientApp) => ({
   User: connection.model(
      clientApp === 'admin' ? 'Admin' : clientApp === 'retailer' ? 'Retailer' : 'User',
      clientApp === 'admin' ? Admin.schema : clientApp === 'retailer' ? Retailer.schema : User.schema
   ),
   UserCredential: connection.model('UserCredential', UserCredential.schema)
});

// 1. REGISTER CONTROLLER
exports.register = async (req, res) => {
   try {
      const { User, UserCredential } = getModels(req.db, req.clientApp);
      const { name, email, phone_number, gender, dob, shop_name, shop_address, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(400).json({ success: false, message: 'Email is already registered' });
      }

      // Create the user profile
      const profileData = req.clientApp === 'admin'
         ? { name, email, phone_number }
         : req.clientApp === 'retailer'
            ? { name, email, phone_number, gender, dob, shop_name, shop_address }
            : { name, email, phone_number, gender, dob };
      const user = new User(profileData);
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
      const { User, UserCredential } = getModels(req.db, req.clientApp);
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

// 3. READ PROFILE
exports.getProfile = async (req, res) => {
   try {
      const { User } = getModels(req.db, req.clientApp);
      const user = await User.findById(req.user.userId).select('-__v');

      if (!user) {
         return res.status(404).json({ success: false, message: 'Profile not found' });
      }

      res.status(200).json({ success: true, user });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
};

// 4. UPDATE PROFILE
exports.updateProfile = async (req, res) => {
   try {
      if (Object.prototype.hasOwnProperty.call(req.body, 'email') ||
         Object.prototype.hasOwnProperty.call(req.body, 'phone_number')) {
         return res.status(400).json({
            success: false,
            message: 'Email and phone number cannot be modified'
         });
      }

      const { User, UserCredential } = getModels(req.db, req.clientApp);
      const editableFields = req.clientApp === 'retailer'
         ? ['name', 'gender', 'dob', 'shop_name', 'shop_address']
         : req.clientApp === 'admin'
            ? ['name']
            : ['name', 'gender', 'dob'];
      const updates = {};

      for (const field of editableFields) {
         if (Object.prototype.hasOwnProperty.call(req.body, field)) {
            updates[field] = req.body[field];
         }
      }

      const user = await User.findByIdAndUpdate(
         req.user.userId,
         { $set: updates },
         { new: true, runValidators: true }
      ).select('-__v');

      if (!user) {
         return res.status(404).json({ success: false, message: 'Profile not found' });
      }

      if (typeof req.body.password === 'string' && req.body.password.length > 0) {
         const credential = await UserCredential.findOne({ user_id: req.user.userId });
         if (!credential) {
            return res.status(404).json({ success: false, message: 'Account credentials not found' });
         }

         credential.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
         await credential.save();
      }

      res.status(200).json({ success: true, message: 'Profile updated successfully', user });
   } catch (error) {
      res.status(400).json({ success: false, error: error.message });
   }
};

// 5. DELETE PROFILE
exports.deleteProfile = async (req, res) => {
   try {
      const { User, UserCredential } = getModels(req.db, req.clientApp);
      const user = await User.findByIdAndDelete(req.user.userId);

      if (!user) {
         return res.status(404).json({ success: false, message: 'Profile not found' });
      }

      await UserCredential.deleteOne({ user_id: req.user.userId });
      res.status(200).json({ success: true, message: 'Profile deleted successfully' });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
};
