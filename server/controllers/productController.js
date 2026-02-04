const Product = require('../models/Product');
const Retailer = require('../models/Retailer');

// @desc    Create new product with images
// @route   POST /api/products/add
exports.addProduct = async (req, res) => {
  try {
    const { productId, name, description, price, category, retailerObjectId } = req.body;

    // 1. Check if images were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one image' });
    }

    // 2. Extract Cloudinary URLs from the uploaded files
    const imageUrls = req.files.map(file => file.path);

    // 3. Create the Product
    const product = await Product.create({
      productId,
      name,
      description,
      price,
      category,
      images: imageUrls,
      soldBy: retailerObjectId // The _id of the retailer
    });

    // 4. Update the Retailer's "itemsSold" list
    await Retailer.findByIdAndUpdate(retailerObjectId, {
      $push: { itemsSold: product._id }
    });

    res.status(201).json({ message: 'Product added successfully!', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};