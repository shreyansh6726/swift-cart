const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
   sold_by: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Retailer reference (sold_by) is required'],
      ref: 'Retailer' // Links to your Retailer model
   },
   name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true
   },
   description: {
      type: String,
      trim: true
   },
   category: {
      type: String,
      trim: true
   },
   stock_quantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock quantity cannot be negative'],
      default: 0
   },
   image_link: {
      type: [String],
      required: [true, 'At least one image link is required']
   },
   metadata: {
      type: [String],
      required: [true, 'Metadata tags/hashtags are required']
   },
   price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
   },
   offer: {
      type: Boolean,
      required: true,
      default: false
   },
   offer_price: {
      type: Number,
      validate: {
         validator: function(v) {
            // If offer is true, offer_price must exist and be less than the regular price
            if (this.offer) {
               return v != null && v < this.price;
            }
            // If offer is false, offer_price should be null or undefined
            return v == null;
         },
         message: 'Offer price must be provided and less than regular price when an offer is active.'
      }
   },
   created_at: {
      type: Date,
      default: Date.now
   }
}, {
   timestamps: false // Preserves your explicit created_at field mapping
});

// Indexes for fast catalog filtering and search
itemSchema.index({ sold_by: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ metadata: 1 });

// Create and export the Item model
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;