const mongoose = require('mongoose');
const UserWishlist = require('../models/user/userWishlist');

const getWishlistModel = (connection) => connection.model('UserWishlist', UserWishlist.schema);

exports.addItem = async (req, res) => {
   try {
      const { item_id } = req.body;
      if (typeof item_id !== 'string' || !mongoose.isValidObjectId(item_id)) {
         return res.status(400).json({ success: false, message: 'A valid item_id is required' });
      }

      const Wishlist = getWishlistModel(req.db);
      const wishlist = await Wishlist.findOneAndUpdate(
         { user_id: req.user.userId },
         { $addToSet: { item_ids: item_id } },
         { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      ).select('user_id item_ids');

      res.status(200).json({
         success: true,
         message: 'Item added to wishlist',
         wishlist
      });
   } catch (error) {
      res.status(400).json({ success: false, error: error.message });
   }
};
