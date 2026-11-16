const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Database Connection & Server Start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
   .then(() => {
      console.log('Connected to MongoDB successfully');
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   })
   .catch(err => console.error('Database connection error:', err));