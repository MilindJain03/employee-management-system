const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle validation errors (already handled by middleware, but just in case)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      errors: Object.keys(err.errors).map(key => ({
        field: key,
        message: err.errors[key].message
      }))
    });
  }

  // Handle custom errors
  if (err.message === 'EMAIL_EXISTS') {
    return res.status(409).json({
      error: 'Email already exists'
    });
  }

  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({
      error: 'Employee not found'
    });
  }

  // Default server error
  res.status(500).json({
    error: 'Internal Server Error'
  });
};

module.exports = errorHandler;
