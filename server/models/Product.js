const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { 
    type: Number, 
    unique: true, 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  // Array of strings to store Cloudinary URLs (Max 10 images)
  images: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 10 images']
  },
  // Reference back to the Retailer
  soldBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Retailer',
    required: true
  },
  price: { type: Number, required: true },
  category: String
}, { timestamps: true });

// Validation function for the image array
function arrayLimit(val) {
  return val.length <= 10;
}

module.exports = mongoose.model('Product', productSchema);