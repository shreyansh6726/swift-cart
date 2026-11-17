const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, wishlistController.addItem);

module.exports = router;
