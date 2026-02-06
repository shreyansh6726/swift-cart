const Product = require('../models/Product');

// @desc    Add a new product
// @route   POST /api/products/add
// @access  Private (Retailer Only)
exports.createProduct = async (req, res) => {
  try {
    // 1. Log the body to debug the "productId is required" error
    // If this is empty, the issue is the order of middleware in productRoutes.js
    console.log("BODY RECEIVED:", req.body);
    console.log("FILES RECEIVED:", req.files ? req.files.length : 0);
    console.log("Form Fields:", req.body);
    console.log("Files:", req.files);

    const { productId, name, description, price, category } = req.body;

    if (!productId || !name || !price) {
      return res.status(400).json({ 
        success: false, 
        message: `Missing required fields. Received: productId=${productId}, name=${name}` 
      });
    }
    // 2. Validate user identity
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: "Session expired or invalid. Please login again." 
      });
    }

    // 3. Handle Cloudinary Image URLs
    // Multer-Cloudinary puts the secure URL in 'path'
    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    if (imageUrls.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "At least one product image is required." 
      });
    }

    // 4. Create and Save Product
    const product = new Product({
      productId: Number(productId), // Convert string to Number
      name,
      description,
      images: imageUrls,
      soldBy: req.user._id, 
      price: Number(price),
      category,
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully!",
      product: savedProduct
    });

  } catch (error) {
    console.error("Mongoose Save Error:", error);

    // Specific error for unique productId constraint
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: `Product ID ${req.body.productId} already exists. Please use a unique SKU.` 
      });
    }

    // Generic Validation or Server Error
    res.status(500).json({ 
      success: false, 
      message: error.message || "An internal server error occurred." 
    });
  }
};