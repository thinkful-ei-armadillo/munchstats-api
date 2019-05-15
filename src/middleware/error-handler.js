
const { NODE_ENV } = require('../config');

// error handler block. Returns a 500 status along with the error
module.exports = function errorHandler(error, req, res, next) {
  const response = (NODE_ENV === 'production')
    ? { error: 'Server error' }
    : (console.error(error), { error: error.message, details: error });

  res.status(500).json(response);
};