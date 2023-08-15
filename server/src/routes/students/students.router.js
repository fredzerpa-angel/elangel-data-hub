const express = require('express');
const {
  httpGetAllStudents,
  httpCreateStudent,
  httpUpdateStudent,
  httpDeleteStudent,
  httpGetStudent,
  httpCreateStudentsByBundle,
} = require('./students.controller');
const { checkUserPrivilegesAccess } = require('../auth/auth.utils');

const studentsRouter = express.Router();

// * Tomar en cuenta el orden de las rutas, ya que la respuesta dependera de cual coincida primero
studentsRouter.get('/:id', checkUserPrivilegesAccess('reports', 'read'), httpGetStudent);
studentsRouter.get('/', checkUserPrivilegesAccess('reports', 'read'), httpGetAllStudents);

// * Los estudiantes son manejadas por ARCADAT por lo que su manejo por el DataHub esta actualmente deshabilitado
// studentsRouter.post('/', checkUserPrivilegesAccess('reports', 'upsert'), httpCreateStudent);

// studentsRouter.put('/:id', checkUserPrivilegesAccess('reports', 'upsert'), httpUpdateStudent);

// studentsRouter.delete('/:id', checkUserPrivilegesAccess('reports', 'delete'), httpDeleteStudent);

module.exports = studentsRouter;
