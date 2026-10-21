function notFound(req, res) {
  return res.status(404).json({ message: 'Route not found' });
}

function errorHandler(error, req, res, next) {
  if (error.name === 'MulterError') {
    return res.status(400).json({
      message: error.code === 'LIMIT_FILE_SIZE'
        ? 'Image must be 2 MB or smaller'
        : error.message,
    });
  }

  if (error.code === '22P02') {
    return res.status(404).json({ message: 'Not found' });
  }

  if (error.expose) {
    return res.status(error.status || 400).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ message: 'Server error' });
}

module.exports = { notFound, errorHandler };
