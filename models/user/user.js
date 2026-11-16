const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
      match: [/^.+@.+\..\+$/, 'Please provide a valid email address']
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
   }
}, {
   timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;