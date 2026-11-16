const mongoose = require('mongoose');

// Define a sub-schema for items in the cart
const cartItemSchema = new mongoose.Schema({
   item_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Item ID is required'],
      ref: 'Item' // Links to your product/item model
   },
   quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      default: 1
   }
}, { _id: false }); // Disables auto-generating an _id for each cart sub-item

const userCartSchema = new mongoose.Schema({
   user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User', // Links to your user profile model
      unique: true // Ensures each user has only one cart document
   },
   items: [cartItemSchema], // Array of embedded item objects
   updated_at: {
      type: Date,
      default: Date.now
   }
}, {
   timestamps: false // We are managing updated_at manually or via pre-save hooks
});

// Middleware to automatically update the 'updated_at' timestamp on modifications
userCartSchema.pre('save', function(next) {
   this.updated_at = Date.now();
   next();
});

// Create and export the model
const UserCart = mongoose.model('UserCart', userCartSchema);

module.exports = UserCart;