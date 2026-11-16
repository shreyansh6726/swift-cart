module.exports = (connection, source) => (req, res, next) => {
   req.db = connection;
   req.clientApp = source;
   next();
};
