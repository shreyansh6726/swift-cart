const mongoose = require('mongoose');

const retailerSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  ownerName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: ['m', 'f', 'o'] },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  retailerId: { type: String, unique: true, required: true },
  // Link to the Products collection
  itemsSold: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Retailer', retailerSchema);