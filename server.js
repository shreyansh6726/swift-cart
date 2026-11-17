const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const itemRoutes = require('./routes/itemRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const { connectDatabases } = require('./config/databases');
const { createDatabaseByOriginMiddleware } = require('./middleware/databaseByOrigin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

async function startServer() {
   try {
      const databases = await connectDatabases();

      // The browser Referer path determines which MongoDB connection is used.
      app.use('/api/auth', createDatabaseByOriginMiddleware(databases), authRoutes);
      app.use('/api/items', createDatabaseByOriginMiddleware(databases), itemRoutes);
      app.use('/api/cart', createDatabaseByOriginMiddleware(databases), cartRoutes);
      app.use('/api/wishlist', createDatabaseByOriginMiddleware(databases), wishlistRoutes);
      app.use('/api/catalog', (req, res, next) => {
         req.db = databases.retailer;
         req.clientApp = 'catalog';
         next();
      }, catalogRoutes);

      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   } catch (error) {
      console.error('Database connection error:', error);
      process.exitCode = 1;
   }
}

startServer();
