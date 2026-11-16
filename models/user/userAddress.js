const mongoose = require('mongoose');

const userAddressSchema = new mongoose.Schema({
   user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User', // Links to your user model
      unique: true // Ensures each user has a single address document
   },
   addresses: {
      type: [String], // Array of address strings
      required: true,
      default: []
   }
}, {
   timestamps: true // Automatically manages createdAt and updatedAt
});

// Create and export the model
const UserAddress = mongoose.model('UserAddress', userAddressSchema);

module.exports = UserAddress;