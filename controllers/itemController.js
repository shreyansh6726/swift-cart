const Item = require('../models/items/item');

function getItemModel(connection) {
   return connection.models.Item || connection.model(Item.modelName, Item.schema);
}

exports.listCatalogItems = async (req, res) => {
   try {
      const ItemModel = getItemModel(req.db);
      const items = await ItemModel.find().sort({ created_at: -1 });
      res.status(200).json({ success: true, items });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
};

exports.listItems = async (req, res) => {
   try {
      if (req.clientApp !== 'retailer') {
         return res.status(403).json({ success: false, message: 'Only retailers can view items' });
      }

      const ItemModel = getItemModel(req.db);
      const items = await ItemModel.find({ sold_by: req.user.userId }).sort({ created_at: -1 });
      res.status(200).json({ success: true, items });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
};

exports.createItem = async (req, res) => {
   try {
      if (req.clientApp !== 'retailer') {
         return res.status(403).json({ success: false, message: 'Only retailers can create items' });
      }

      const { name, description, category, stock_quantity, image_link, metadata, price, offer, offer_price } = req.body;
      const ItemModel = getItemModel(req.db);

      const item = new ItemModel({
         sold_by: req.user.userId,
         name,
         description,
         category,
         stock_quantity,
         image_link,
         metadata,
         price,
         offer,
         offer_price: offer ? offer_price : undefined
      });

      await item.save();
      res.status(201).json({ success: true, message: 'Item created successfully', item });
   } catch (error) {
      res.status(400).json({ success: false, error: error.message });
   }
};

exports.updateItem = async (req, res) => {
   try {
      if (req.clientApp !== 'retailer') {
         return res.status(403).json({ success: false, message: 'Only retailers can update items' });
      }

      const { name, description, category, stock_quantity, image_link, metadata, price, offer, offer_price } = req.body;
      const ItemModel = getItemModel(req.db);
      const item = await ItemModel.findOneAndUpdate(
         { _id: req.params.id, sold_by: req.user.userId },
         {
            $set: {
               name,
               description,
               category,
               stock_quantity,
               image_link,
               metadata,
               price,
               offer,
               offer_price: offer ? offer_price : undefined
            }
         },
         { new: true, runValidators: true }
      );

      if (!item) {
         return res.status(404).json({ success: false, message: 'Item not found' });
      }

      res.status(200).json({ success: true, message: 'Item updated successfully', item });
   } catch (error) {
      res.status(400).json({ success: false, error: error.message });
   }
};

exports.deleteItem = async (req, res) => {
   try {
      if (req.clientApp !== 'retailer') {
         return res.status(403).json({ success: false, message: 'Only retailers can delete items' });
      }

      const ItemModel = getItemModel(req.db);
      const item = await ItemModel.findOneAndDelete({
         _id: req.params.id,
         sold_by: req.user.userId
      });

      if (!item) {
         return res.status(404).json({ success: false, message: 'Item not found' });
      }

      res.status(200).json({ success: true, message: 'Item deleted successfully' });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
};
