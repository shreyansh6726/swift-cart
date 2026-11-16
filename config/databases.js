const mongoose = require('mongoose');

const connectionOptions = {
   serverSelectionTimeoutMS: 10000
};

async function connectDatabases() {
   const uris = {
      customer: process.env.CUSTOMER_MONGO_URI || process.env.MONGO_URI,
      retailer: process.env.RETAILER_MONGO_URI || process.env.MONGO_URI,
      admin: process.env.ADMIN_MONGO_URI || process.env.MONGO_URI
   };

   for (const [name, uri] of Object.entries(uris)) {
      if (!uri) {
         throw new Error(`${name.toUpperCase()}_MONGO_URI or MONGO_URI is not configured`);
      }
   }

   const databases = {};
   for (const [name, uri] of Object.entries(uris)) {
      databases[name] = mongoose.createConnection(uri, connectionOptions);
      await databases[name].asPromise();
      console.log(`Connected to ${name} MongoDB successfully`);
   }

   return databases;
}

module.exports = { connectDatabases };
