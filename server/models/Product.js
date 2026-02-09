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
  images: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 10 images']
  },
  soldBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Retailer',
    required: true
  },
  price: { type: Number, required: true },
  category: String
}, { timestamps: true });

function arrayLimit(val) {
  return val.length <= 10;
}

module.exports = mongoose.model('Product', productSchema);