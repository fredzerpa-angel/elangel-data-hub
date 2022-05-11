const express = require('express');
const { httpGetAllStudents, httpCreateStudent, httpUpdateStudent, httpDeleteStudent } = require('./students.controller');

const studentsRouter = express.Router();

studentsRouter.get('/', httpGetAllStudents);
studentsRouter.post('/', httpCreateStudent);
studentsRouter.patch('/:id', httpUpdateStudent);
studentsRouter.delete('/:id', httpDeleteStudent);

module.exports = studentsRouter;