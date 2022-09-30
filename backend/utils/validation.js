const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  // validationResults returns a result object
    const validationErrors = validationResult(req);
    // check if object is empty, if not make it into an array and map out the messages.
    if (!validationErrors.isEmpty()) {
      const errors = validationErrors
      .array()
      .map((error) => `${error.msg}`);

      // create a new error object and add array of error messages to the object
      const err = Error('Bad request.');
      err.errors = errors;
      err.status = 400;
      err.title = 'Bad request.';
      next(err);
    }
    next();
  };

  module.exports = {
    handleValidationErrors
  };
