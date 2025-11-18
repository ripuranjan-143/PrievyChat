// wrapasync route handlers to avoid repetitive try/catch blocks

const wrapAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export { wrapAsync };
