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

// * Tomar en cuenta el orden de las rutas, ya que la respuesta dependera de cual coincida primero
employeesRouter.get('/:id', httpGetEmployee);
employeesRouter.get('/', httpGetAllEmployees);

employeesRouter.post('/bundle', httpCreateEmployeesByBundle);
employeesRouter.post('/', httpCreateEmployee);

employeesRouter.put('/:id', httpUpdateEmployee);

employeesRouter.delete('/:id', httpDeleteEmployee);

module.exports = employeesRouter;
