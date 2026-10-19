const express = require('express');
const controller = require('../controllers/employeeController');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');
const { employeeFields, employeeId, deleteId } = require('../validators/schemas');

const router = express.Router();

// Require authentication for every employee endpoint.
router.use(authenticate);

// Register employee CRUD routes with their validation middleware.
router.get('/employees', controller.list);
router.post('/employees', employeeFields, validate, controller.create);
router.get('/employees/:eid', employeeId, validate, controller.getById);
router.put('/employees/:eid', employeeId, employeeFields, validate, controller.update);
router.delete('/employees', deleteId, validate, controller.remove);

module.exports = router;
