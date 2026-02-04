require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const path = require('path'); // Added for handling file paths
const connectDB = require('./config/db');

const app = express();

// 1. Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 2. Static Folder for Uploads
// This allows your React frontend to view the images you upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Database Connection
connectDB();

// 4. API Routes
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/retailers', require('./routes/retailerRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

app.get('/', (req, res) => {
  res.send('ByteDesk E-commerce API is live and running 🚀');
});

// 5. Global Error Handling
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