const asyncHandler = (fn) => {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      next(error);
    });
  };
};

// Named exports
export { asyncHandler };

// Default export
export default asyncHandler;
