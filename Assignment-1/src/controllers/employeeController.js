const Employee = require('../models/Employee');

// Fields that clients are allowed to change when updating an employee.
const EMPLOYEE_FIELDS = [
  'first_name',
  'last_name',
  'email',
  'position',
  'salary',
  'date_of_joining',
  'department',
];

// Standard response body for missing employees.
const employeeNotFound = {
  error: {
    code: 'EMPLOYEE_NOT_FOUND',
    message: 'Employee not found',
  },
};

// Build a query that restricts employee access to the current user.
function employeeQuery(userId, employeeId) {
  return {
    _id: employeeId,
    user: userId,
  };
}

// Return all employees owned by the authenticated user.
async function list(req, res, next) {
  try {
    const employees = await Employee.find({ user: req.user.id }).sort({
      created_at: -1,
    });

    res.status(200).json({ employees });
  } catch (err) {
    next(err);
  }
}

// Create an employee and associate it with the authenticated user.
async function create(req, res, next) {
  try {
    const employee = await Employee.create({ ...req.body, user: req.user.id });

    req.log('info', `employee_created employee_id=${employee.id} owner_id=${req.user.id}`);
    res.status(201).json({ message: 'Employee created successfully', employee });
  } catch (err) {
    next(err);
  }
}

// Return one employee when it belongs to the authenticated user.
async function getById(req, res, next) {
  try {
    const employee = await Employee.findOne(
      employeeQuery(req.user.id, req.params.eid),
    );

    if (!employee) {
      return res.status(404).json(employeeNotFound);
    }

    res.status(200).json({ employee });
  } catch (err) {
    next(err);
  }
}

// Update only the permitted employee fields.
async function update(req, res, next) {
  try {
    const changes = Object.fromEntries(
      EMPLOYEE_FIELDS
        .filter((field) => req.body[field] !== undefined)
        .map((field) => [field, req.body[field]]),
    );

    const employee = await Employee.findOneAndUpdate(
      employeeQuery(req.user.id, req.params.eid),
      changes,
      { new: true, runValidators: true },
    );

    if (!employee) {
      return res.status(404).json(employeeNotFound);
    }

    req.log('info', `employee_updated employee_id=${employee.id} owner_id=${req.user.id}`);
    res.status(200).json({ message: 'Employee updated successfully', employee });
  } catch (err) {
    next(err);
  }
}

// Delete one employee owned by the authenticated user.
async function remove(req, res, next) {
  try {
    const employee = await Employee.findOneAndDelete(
      employeeQuery(req.user.id, req.query.eid),
    );

    if (!employee) {
      return res.status(404).json(employeeNotFound);
    }

    req.log('info', `employee_deleted employee_id=${employee.id} owner_id=${req.user.id}`);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, getById, update, remove };
