const express = require('express');
const {
  httpGetAllStudents,
  httpCreateStudent,
  httpUpdateStudent,
  httpDeleteStudent,
  httpGetStudent,
  httpCreateStudentsByBundle,
} = require('./students.controller');

const studentsRouter = express.Router();

// * Tomar en cuenta el orden de las rutas, ya que la respuesta dependera de cual coincida primero
studentsRouter.get('/:id', httpGetStudent);
studentsRouter.get('/', httpGetAllStudents);

studentsRouter.post('/bundle', httpCreateStudentsByBundle);
studentsRouter.post('/', httpCreateStudent);

studentsRouter.put('/:id', httpUpdateStudent);

studentsRouter.delete('/:id', httpDeleteStudent);

module.exports = studentsRouter;
