const express = require('express');
const router = express.Router();
const { addProduct } = require('../controllers/productController');
const { upload } = require('../config/cloudinary');

// 'images' is the name of the field coming from the React form
// .array('images', 10) limits the upload to 10 files
router.post('/add', upload.array('images', 10), addProduct);

module.exports = router;