const mongoose = require('mongoose');

const connectionOptions = {
   serverSelectionTimeoutMS: 10000
};

function withDatabaseName(uri, databaseName) {
   const match = uri.match(/^(mongodb(?:\+srv)?:\/\/[^/]+)(?:\/[^?]*)?(\?.*)?$/);

   if (!match) {
      throw new Error('MONGO_URI must be a valid MongoDB connection string');
   }

   return `${match[1]}/${databaseName}${match[2] || ''}`;
}

async function connectDatabases() {
   const baseUri = process.env.MONGO_URI;

   if (!baseUri) {
      throw new Error('MONGO_URI is not configured');
   }

   const uris = {
      customer: withDatabaseName(baseUri, 'user'),
      retailer: withDatabaseName(baseUri, 'retailer'),
      admin: withDatabaseName(baseUri, 'swift_cart_admin')
   };

   const databases = {};
   for (const [name, uri] of Object.entries(uris)) {
      databases[name] = mongoose.createConnection(uri, connectionOptions);
      await databases[name].asPromise();
      console.log(`Connected to ${name} MongoDB successfully`);
   }

   return databases;
}

module.exports = { connectDatabases };
