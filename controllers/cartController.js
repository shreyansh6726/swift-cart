const UserCart = require('../models/user/userCart');

const getCartModel = (connection) => connection.model('UserCart', UserCart.schema);

exports.getCart = async (req, res) => {
   try {
      const Cart = getCartModel(req.db);
      const cart = await Cart.findOne({ user_id: req.user.userId }).select('user_id item_ids quantities updated_at');

      res.status(200).json({
         success: true,
         cart: cart || { user_id: req.user.userId, item_ids: [], quantities: [] }
      });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
};

exports.updateCart = async (req, res) => {
   try {
      const { item_ids, quantities } = req.body;
      if (!Array.isArray(item_ids) ||
         item_ids.some((itemId) => typeof itemId !== 'string') ||
         new Set(item_ids).size !== item_ids.length ||
         !Array.isArray(quantities) ||
         quantities.length !== item_ids.length ||
         quantities.some((quantity) => !Number.isInteger(quantity) || quantity < 1)) {
         return res.status(400).json({
            success: false,
            message: 'item_ids must be unique and have a matching quantities array of positive integers'
         });
      }

      const Cart = getCartModel(req.db);
      const cart = await Cart.findOneAndUpdate(
         { user_id: req.user.userId },
         { $set: { item_ids, quantities, updated_at: new Date() } },
         { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      ).select('user_id item_ids quantities updated_at');

      res.status(200).json({ success: true, cart });
   } catch (error) {
      res.status(400).json({ success: false, error: error.message });
   }
};
