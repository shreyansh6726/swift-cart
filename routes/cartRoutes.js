const express = require('express');
const cartController = require('../controllers/cartController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, cartController.getCart);
router.put('/', verifyToken, cartController.updateCart);

module.exports = router;
