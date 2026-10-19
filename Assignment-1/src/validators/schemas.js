const { body, param, query } = require('express-validator');

// Validate new user registration data.
const signup = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .matches(/^[A-Za-z0-9_.-]+$/)
    .withMessage('Use 3-30 letters, numbers, dots, underscores or hyphens'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('A valid email is required'),
  body('password')
    .isString()
    .isLength({ min: 8, max: 128 })
    .matches(/[a-z]/)
    .matches(/[A-Z]/)
    .matches(/[0-9]/)
    .withMessage('Password must be 8-128 characters and include lowercase, uppercase and a number'),
];

// Validate username/email login data.
const login = [
  body('password').isString().isLength({ min: 1, max: 128 }),
  body()
    .custom((value) => Boolean(value.username || value.email))
    .withMessage('Username or email is required'),
  body('username').optional().trim().isLength({ min: 3, max: 30 }),
  body('email').optional().trim().isEmail().normalizeEmail(),
];

// Validate employee fields submitted in create and update requests.
const employeeFields = [
  body('first_name').trim().isLength({ min: 1, max: 60 }),
  body('last_name').trim().isLength({ min: 1, max: 60 }),
  body('email').trim().isEmail().normalizeEmail(),
  body('position').trim().isLength({ min: 1, max: 100 }),
  body('salary').isFloat({ min: 0 }).toFloat(),
  body('date_of_joining').isISO8601({ strict: true }).toDate(),
  body('department').trim().isLength({ min: 1, max: 100 }),
];

// Validate employee IDs supplied in route parameters or query strings.
const employeeId = [param('eid').isMongoId().withMessage('A valid employee ID is required')];
const deleteId = [query('eid').isMongoId().withMessage('A valid employee ID is required')];

module.exports = { signup, login, employeeFields, employeeId, deleteId };
