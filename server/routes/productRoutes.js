const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Product = require('../models/Product');
const { protect, retailerOnly } = require('../middleware/authMiddleware');
const { createProduct, getProductById } = require('../controllers/productController');
const upload = require('../config/cloudinary');

if (!upload || typeof upload.array !== 'function') {
  console.error("ERROR: Multer 'upload' is not initialized correctly in productRoutes.js");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bytedesk_products',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

// Get all products - used by Home.jsx (GET /api/products)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/my-products', protect, retailerOnly, async (req, res) => {
  try {
    const products = await Product.find({ soldBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { name, category, soldBy } = req.query;
    let query = {};
    if (soldBy) query.soldBy = soldBy;
    if (category) query.category = category;
    if (name) query.name = { $regex: name, $options: 'i' };

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', getProductById);
router.post('/add', protect, retailerOnly, upload.array('images', 10), createProduct);
module.exports = router;