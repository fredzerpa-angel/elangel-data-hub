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

studentsRouter.get('/', httpGetAllStudents);
studentsRouter.get('/:id', httpGetStudent);
studentsRouter.post('/', httpCreateStudent);
studentsRouter.post('/bundle', httpCreateStudentsByBundle);
studentsRouter.patch('/:id', httpUpdateStudent);
studentsRouter.delete('/:id', httpDeleteStudent);

module.exports = studentsRouter;
