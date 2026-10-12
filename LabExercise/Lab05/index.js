const express = require('express');
const path = require('path');
const app = express();
const userRouter = require('./routes/users');

app.use(express.json());

// Add User Router
//Fixed
app.use('/api/v1/user', userRouter);

/*
- Create new html file name home.html
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
// Fixed: `router` was undefined here, the app object must be used
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

// Route that throws, useful for showing the error middleware in Postman
app.get('/error', (req, res, next) => {
  next(new Error('Test error'));
});

/*
Add error handling middleware to handle below error
- Return 500 page with message "Server Error"
*/
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

// process.env.PORT is the standard name used by hosting platforms
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log('Web Server is listening at port ' + PORT);
});
