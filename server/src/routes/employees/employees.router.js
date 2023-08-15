const express = require('express');
const {
  httpGetAllEmployees,
  httpCreateEmployee,
  httpUpdateEmployee,
  httpDeleteEmployee,
  httpGetEmployee,
  httpCreateEmployeesByBundle,
} = require('./employees.controller');
const { checkUserPrivilegesAccess } = require('../auth/auth.utils');

const employeesRouter = express.Router();

// * Tomar en cuenta el orden de las rutas, ya que la respuesta dependera de cual coincida primero
employeesRouter.get('/:id', checkUserPrivilegesAccess('reports', 'read'), httpGetEmployee);
employeesRouter.get('/', checkUserPrivilegesAccess('reports', 'read'), httpGetAllEmployees);

// * Los empleados son manejadas por ARCADAT por lo que su manejo por el DataHub esta actualmente deshabilitado
// employeesRouter.post('/', checkUserPrivilegesAccess('reports', 'upsert'), httpCreateEmployee);

// employeesRouter.put('/:id', checkUserPrivilegesAccess('reports', 'upsert'), httpUpdateEmployee);

// employeesRouter.delete('/:id', checkUserPrivilegesAccess('reports', 'delete'), httpDeleteEmployee);

module.exports = employeesRouter;
