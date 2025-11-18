// custom error class to attach status codes and send structured errors
class ExpressError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export { ExpressError };
