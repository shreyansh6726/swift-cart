const mongoose = require('mongoose');

const userCartSchema = new mongoose.Schema({
   user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User',
      unique: true
   },
   item_ids: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
   }],
   quantities: [{
      type: Number,
      min: [1, 'Quantity must be at least 1'],
      required: [true, 'Quantity is required']
   }],
   updated_at: {
      type: Date,
      default: Date.now
   }
}, {
   timestamps: false
});

userCartSchema.pre('save', function(next) {
   this.updated_at = Date.now();
   next();
});

const UserCart = mongoose.model('UserCart', userCartSchema);

module.exports = UserCart;