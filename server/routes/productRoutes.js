const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Product = require('../models/Product');

// 1. Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Setup Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bytedesk_products',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage: storage });

// 3. POST: Add Product
router.post('/add', upload.array('images', 10), async (req, res) => {
  try {
    const { productId, name, description, price, category, soldBy } = req.body;

    const imageUrls = req.files.map(file => file.path);

    const newProduct = new Product({
      productId,
      name,
      description,
      price,
      category,
      soldBy, 
      images: imageUrls
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ 
      success: true, 
      message: 'Product added successfully!', 
      product: savedProduct 
    });

  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. GET: Fetch all products for a specific retailer
router.get('/retailer/:retailerId', async (req, res) => {
  try {
    const { retailerId } = req.params;
    const products = await Product.find({ soldBy: retailerId }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching products", error: error.message });
  }
});

// 5. GET: Search and Filter products
// Usage: /api/products/search?name=phone&category=electronics&soldBy=ID
router.get('/search', async (req, res) => {
  try {
    const { name, category, soldBy } = req.query;
    let query = {};

    // Filter by retailer if ID is provided
    if (soldBy) query.soldBy = soldBy;

    // Filter by category (exact match)
    if (category) query.category = category;

    // Search by name (case-insensitive partial match)
    if (name) query.name = { $regex: name, $options: 'i' };

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: "Search failed", error: error.message });
  }
});

module.exports = router;