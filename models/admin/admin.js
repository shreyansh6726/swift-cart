const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100
   },
   email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
   },
   phone_number: {
      type: Number,
      required: [true, 'Phone number is required'],
      min: [1000000000, 'Phone number must be at least 10 digits'],
      max: [9999999999, 'Phone number cannot exceed 10 digits']
   }
}, {
   timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
