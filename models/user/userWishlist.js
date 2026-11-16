const mongoose = require('mongoose');

const userWishlistSchema = new mongoose.Schema({
   user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User', // Links to your user profile model
      unique: true // Ensures each user has a single wishlist document
   },
   item_ids: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item' // Links to your product/item model
   }]
}, {
   timestamps: true // Automatically manages createdAt and updatedAt
});

// Create and export the model
const UserWishlist = mongoose.model('UserWishlist', userWishlistSchema);

module.exports = UserWishlist;