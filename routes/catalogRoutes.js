const express = require('express');
const itemController = require('../controllers/itemController');

const router = express.Router();

router.get('/items', itemController.listCatalogItems);

module.exports = router;
