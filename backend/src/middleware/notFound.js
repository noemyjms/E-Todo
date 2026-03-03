module.exports = (req, res, next) => {
  res.status(404).json({
    error: 'Route introuvable',
    path: req.originalUrl,
  });
};
