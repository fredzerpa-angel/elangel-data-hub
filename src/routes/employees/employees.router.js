const express = require('express');
const {
  httpGetAllEmployees,
  httpCreateEmployee,
  httpUpdateEmployee,
  httpDeleteEmployee,
  httpGetEmployee,
  httpCreateEmployeesByBundle,
} = require('./employees.controller');

const employeesRouter = express.Router();

employeesRouter.get('/', httpGetAllEmployees);
employeesRouter.get('/:id', httpGetEmployee);
employeesRouter.post('/', httpCreateEmployee);
employeesRouter.post('/bundle', httpCreateEmployeesByBundle);
employeesRouter.patch('/:id', httpUpdateEmployee);
employeesRouter.delete('/:id', httpDeleteEmployee);

module.exports = employeesRouter;
