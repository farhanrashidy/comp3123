const { validationResult } = require('express-validator');

// Return validation errors collected by express-validator.
function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  const errors = result
    .array()
    .map(({ path, msg }) => ({ field: path, message: msg }));
  req.log('warn', `validation_failed count=${errors.length}`);
  return res.status(400).json({
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      fields: errors,
    },
  });
}

module.exports = validate;
