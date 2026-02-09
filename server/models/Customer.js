const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  age: { 
    type: Number, 
    required: true,
    min: 13 
  },
  gender: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true,
    enum: ['male', 'female', 'other'] 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  cart: { 
    type: [Number], 
    default: null 
  }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);