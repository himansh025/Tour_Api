class ApiError extends Error {
    constructor(
      statusCode,
      message = "Something went wrong",
      errors = [],
      stack = ""
    ) {
      super(message); // Call the parent Error class constructor
      this.statusCode = statusCode;
      this.success = false; // Default success status
      this.errors = errors; // Optional list of additional error details
  
      if (stack) {
        this.stack = stack; // Use custom stack trace if provided
      } else {
        Error.captureStackTrace(this, this.constructor); // Capture stack trace
      }
    }
  }
  
  module.exports = ApiError; // Export the class for use in other files
  