function createDatabaseByOriginMiddleware(databases) {
   return (req, res, next) => {
      // The frontend sends its current root path because cross-origin browser
      // requests may strip that path from the Referer header.
      let pathname = '/';
      const frontendPath = req.get('x-frontend-path');
      const referer = req.get('referer');

      if (frontendPath) {
         pathname = frontendPath.split('?')[0].replace(/\/+$/, '') || '/';
      } else if (referer) {
         try {
            pathname = new URL(referer).pathname.replace(/\/+$/, '') || '/';
         } catch {
            pathname = '/';
         }
      }

      if (pathname === '/admin' || pathname.startsWith('/admin/')) {
         req.db = databases.admin;
         req.clientApp = 'admin';
      } else if (pathname === '/retailer' || pathname.startsWith('/retailer/')) {
         req.db = databases.retailer;
         req.clientApp = 'retailer';
      } else {
         req.db = databases.customer;
         req.clientApp = 'customer';
      }

      next();
   };
}

module.exports = { createDatabaseByOriginMiddleware };
