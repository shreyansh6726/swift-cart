const express = require('express');
const router = express.Router();
const { registerRetailer, loginRetailer } = require('../controllers/retailerController');

router.post('/register', registerRetailer);
router.post('/login', loginRetailer);

module.exports = router;