const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
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
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: "Session expired or invalid. Please login again." 
      });
    }

    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    if (imageUrls.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "At least one product image is required." 
      });
    }

    const product = new Product({
      productId: Number(productId), 
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

    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: `Product ID ${req.body.productId} already exists. Please use a unique SKU.` 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: error.message || "An internal server error occurred." 
    });
  }
};