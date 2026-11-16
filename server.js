const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const { connectDatabases } = require('./config/databases');
const databaseContext = require('./middleware/databaseContext');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

async function startServer() {
   try {
      const databases = await connectDatabases();

      // The route namespace determines which MongoDB connection is used.
      app.use('/api/customer', databaseContext(databases.customer, 'customer'), authRoutes);
      app.use('/api/retailer', databaseContext(databases.retailer, 'retailer'), authRoutes);
      app.use('/api/admin', databaseContext(databases.admin, 'admin'), authRoutes);

      // Backward-compatible alias for older customer clients.
      app.use('/api/auth', databaseContext(databases.customer, 'customer'), authRoutes);

      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   } catch (error) {
      console.error('Database connection error:', error);
      process.exitCode = 1;
   }
}

startServer();
