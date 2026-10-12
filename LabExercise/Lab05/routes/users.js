const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const USER_FILE = path.join(__dirname, '..', 'user.json');

// Helper: read and parse user.json, passing any failure to the error middleware
function readUser(next, callback) {
  fs.readFile(USER_FILE, 'utf8', (err, data) => {
    if (err) return next(err);
    try {
      callback(JSON.parse(data));
    } catch (parseErr) {
      next(parseErr);
    }
  });
}

/*
- Return all details from user.json file to client as JSON format
*/
router.get('/profile', (req, res, next) => {
  readUser(next, (user) => res.json(user));
});

/*
- Modify /login route to accept username and password as JSON body parameter
- Read data from user.json file
- If username and password is valid then send resonse as below
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below
    {
        status: false,
        message: "User Name is invalid"
    }
- If password is invalid then send response as below
    {
        status: false,
        message: "Password is invalid"
    }
*/
router.post('/login', (req, res, next) => {
  const { username, password } = req.body || {};

  readUser(next, (user) => {
    if (username !== user.username) {
      return res.json({ status: false, message: 'User Name is invalid' });
    }
    if (password !== user.password) {
      return res.json({ status: false, message: 'Password is invalid' });
    }
    res.json({ status: true, message: 'User Is valid' });
  });
});

/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logged out.<b>
*/
router.get('/logout/:username', (req, res) => {
  res.send(`<b>${req.params.username} successfully logged out.</b>`);
});

module.exports = router;
