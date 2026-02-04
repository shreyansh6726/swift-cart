require('dotenv').config(); // Load environment variables first
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize the Express application
const app = express();

// 1. Database Connection
// This connects to the MongoDB string provided in your .env
connectDB();

// 2. Middleware
app.use(cors()); // Enables cross-origin requests from your React frontend
app.use(express.json()); // Parses incoming JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data (form submissions)

// 3. API Routes
// Mapping specific endpoints to their respective route files
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/retailers', require('./routes/retailerRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// 4. Base/Health Check Route
app.get('/', (req, res) => {
  res.send('ByteDesk E-commerce API is live and running 🚀');
});

// 5. Global Error Handling (Optional but recommended)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// 6. Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server confirmed running on port ${PORT}`);
});