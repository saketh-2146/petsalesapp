export const errorHandler = (err, req, res, next) => {
  // Log the full error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Unhandled Error:', err.stack || err.message, err);
  } else {
    console.error('Error:', err.message, err);
  }

  // Handle fetch failures from Supabase
  if (err.message && err.message.includes('fetch failed')) {
    return res.status(502).json({
      error: { message: 'Database connection failed. Please check your Supabase URL and network connection.' }
    });
  }

  // Handle Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: { message: 'File too large. Maximum size is 10MB.' }
    });
  }
  if (err.message && err.message.includes('Only JPEG')) {
    return res.status(400).json({
      error: { message: err.message }
    });
  }

  // Handle Supabase-specific error codes
  if (err.code === '42P01') {
    return res.status(500).json({
      error: { message: 'Database table not found. Please run the schema migration.' }
    });
  }
  if (err.code === 'PGRST301') {
    return res.status(403).json({
      error: { message: 'Access denied. Row Level Security policy is blocking this request.' }
    });
  }
  if (err.code === 'PGRST116') {
    return res.status(404).json({
      error: { message: 'Resource not found.' }
    });
  }
  if (err.code === '23505') {
    return res.status(409).json({
      error: { message: 'Duplicate entry. This resource already exists.' }
    });
  }
  if (err.code === '23503') {
    return res.status(400).json({
      error: { message: 'Referenced resource does not exist.' }
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};
