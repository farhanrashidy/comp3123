const express = require('express');
const rateLimit = require('express-rate-limit');
const controller = require('../controllers/userController');
const { signup, login } = require('../validators/schemas');
const validate = require('../middleware/validate');

const router = express.Router();

// Limit repeated signup and login attempts.
const authLimiter = rateLimit({
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  limit: Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many authentication attempts. Try again later.',
    },
  },
  handler: (req, res, next, options) => {
    req.log('warn', 'rate_limit_exceeded scope=authentication');
    res.status(options.statusCode).json(options.message);
  },
});

// Register public authentication routes with validation.
router.post('/signup', authLimiter, signup, validate, controller.signup);
router.post('/login', authLimiter, login, validate, controller.login);

module.exports = router;
