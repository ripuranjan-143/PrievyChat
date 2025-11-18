// wrapasync route handlers to avoid repetitive try/catch blocks

export default (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
