const notFound = (req, res, next) => {
  res.status(404);

  next(new Error(`Route Not Found - ${req.originalUrl}`));
};

export default notFound;
