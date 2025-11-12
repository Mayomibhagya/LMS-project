// backend/src/middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error('Error:',err.stack);

  const statusCode = err.statusCode || 500;
  res.status(StatusCode).json({
     success: false,
     message: err.message || 'Server Error'});
};
