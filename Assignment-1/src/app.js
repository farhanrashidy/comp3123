const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const { notFound, errorHandler } = require('./middleware/errors');

// Create the Express application and prepare file-based logging.
const app = express();
const logDirectory = path.join(__dirname, '..', 'logs');
fs.mkdirSync(logDirectory, { recursive: true });
const logStream = fs.createWriteStream(path.join(logDirectory, 'application.log'), { flags: 'a' });

// Add a shared request logger to each request.
app.use((req, res, next) => {
  req.log = (level, message) => logStream.write(
    `${new Date().toISOString()} ${level.toUpperCase()} ${message}\n`,
  );
  next();
});

// Apply security headers, request logging, and request body parsing.
app.use(helmet());
app.use(morgan(':date[iso] :method :url :status :response-time ms', {
  stream: {
    write: (line) => logStream.write(line),
  },
}));
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: false, limit: '32kb' }));

// Limit the number of requests sent to the API.
app.use('/api', rateLimit({
  windowMs: Number(process.env.API_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  limit: Number(process.env.API_RATE_LIMIT_MAX) || 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => {
    req.log('warn', 'rate_limit_exceeded scope=api');
    res.status(429).json({
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many API requests. Try again later.',
      },
    });
  },
}));

// Provide a simple health-check endpoint.
app.get('/health', (req, res) => res.status(200).json({
  status: 'ok',
  service: 'comp3123-assignment1-api',
  timestamp: new Date().toISOString(),
}));

// Mount application routes and final error handlers.
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
