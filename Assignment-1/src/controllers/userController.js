const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user after checking for duplicate credentials.
async function signup(req, res, next) {
  try {
    const username = req.body.username.trim();
    const email = req.body.email.trim().toLowerCase();
    if (await User.exists({ $or: [{ username }, { email }] })) {
      return res.status(409).json({
        error: {
          code: 'USER_EXISTS',
          message: 'Username or email is already registered',
        },
      });
    }

    const user = await User.create({ username, email, password: req.body.password });
    req.log('info', `signup_succeeded user_id=${user.id}`);
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: {
          code: 'USER_EXISTS',
          message: 'Username or email is already registered',
        },
      });
    }

    next(err);
  }
}

// Authenticate a user and return a signed JWT.
async function login(req, res, next) {
  try {
    const identifier = req.body.username
      ? { username: req.body.username.trim() }
      : { email: req.body.email.trim().toLowerCase() };
    const user = await User.findOne(identifier).select('+password');
    const valid = user
      ? await user.verifyPassword(req.body.password)
      : await bcrypt.compare(
          req.body.password,
          '$2a$12$C6UzMDM.H6dfI/f/IKcEe.5g9uN5kQGQfC8tpO9jQ8E7J7k4t0L6a',
        );
    if (!user || !valid) {
      req.log('warn', 'login_failed reason=invalid_credentials');
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid username/email or password',
        },
      });
    }

    const token = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      },
    );
    req.log('info', `login_succeeded user_id=${user.id}`);
    res.status(200).json({
      message: 'Login successful',
      token,
      token_type: 'Bearer',
      expires_in: process.env.JWT_EXPIRES_IN || '1h',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login };
