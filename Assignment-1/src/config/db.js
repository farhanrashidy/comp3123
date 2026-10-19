const mongoose = require('mongoose');

// Connect to MongoDB
async function connectDatabase(uri) {
  if (!uri) throw new Error('MONGODB_URI is required');

  // query filtering and select the application database.
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { dbName: 'comp3123_assignment1' });

  return mongoose.connection;
}

module.exports = connectDatabase;
