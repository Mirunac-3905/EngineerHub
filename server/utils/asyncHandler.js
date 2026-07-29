// Wrap async route handlers so thrown errors are forwarded to the error
// middleware instead of crashing the process.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
