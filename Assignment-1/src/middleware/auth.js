const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify the Bearer token and attach the authenticated user to the request.
async function authenticate(req, res, next) {
  const header = req.get('authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    req.log('warn', 'authentication_failed reason=missing_or_malformed_bearer');
    return res.status(401).json({
      error: {
        code: 'AUTH_REQUIRED',
        message: 'A valid Bearer token is required',
      },
    });
  }

  // Validate the token and load the associated user.
  try {
    const payload = jwt.verify(match[1], process.env.JWT_SECRET, { algorithms: ['HS256'] });
    const user = await User.findById(payload.sub).select('_id username email');
    if (!user) throw new Error('Token user no longer exists');
    req.user = user;
    next();
  } catch (err) {
    req.log('warn', 'authentication_failed reason=invalid_or_expired_token');
    res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'The token is invalid or expired',
      },
    });
  }
}

module.exports = authenticate;
