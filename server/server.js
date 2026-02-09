require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const connectDB = require('./config/db');

const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();

app.use('/customers', require('./routes/customerRoutes'));
app.use('/retailers', require('./routes/retailerRoutes'));
app.use('/products', require('./routes/productRoutes'));

app.get('/', (req, res) => {
  res.send('ByteDesk E-commerce API is live and running 🚀');
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server confirmed running on port ${PORT}`);
});