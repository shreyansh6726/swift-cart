const mongoose = require('mongoose');

const retailerSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Retailer name is required'],
      trim: true,
      maxlength: 100
   },
   email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^.+@.+\..+$/, 'Please provide a valid email address']
   },
   phone_number: {
      type: Number,
      required: [true, 'Phone number is required'],
      min: [1000000000, 'Phone number must be at least 10 digits'],
      max: [9999999999, 'Phone number cannot exceed 10 digits']
   },
   gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: {
         values: ['male', 'female', 'others'],
         message: '{VALUE} is not a supported gender type'
      }
   },
   dob: {
      type: Date,
      required: [true, 'Date of birth is required']
   },
   shop_name: {
      type: String,
      required: [true, 'Shop name is required'],
      trim: true
   },
   shop_address: {
      type: String,
      required: [true, 'Shop address is required'],
      trim: true
   }
}, {
   timestamps: true // Automatically manages createdAt and updatedAt
});

// Create and export the Retailer model
const Retailer = mongoose.model('Retailer', retailerSchema);

module.exports = Retailer;