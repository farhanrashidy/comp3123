require('dotenv').config();
const app = require('./app');
const connectDatabase = require('./config/db');

// Connect to the database and start the HTTP server.
async function start() {
  // Ensure the application has a sufficiently strong JWT secret.
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be set to at least 32 characters');
  }

  await connectDatabase(process.env.MONGODB_URI);
  const port = Number(process.env.PORT) || 3000;

  // Start listening and record the server startup event.
  app.listen(port, () => {
    const line = `${new Date().toISOString()} INFO server_started port=${port} database=comp3123_assignment1\n`;
    require('fs').appendFileSync(
      require('path').join(__dirname, '..', 'logs', 'application.log'),
      line,
    );
    console.log(`API listening on port ${port}`);
  });
}

start().catch((err) => {
  console.error(`Startup failed: ${err.message}`);
  process.exit(1);
});
