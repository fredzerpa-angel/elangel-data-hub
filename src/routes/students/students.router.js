const express = require('express');
const { httpGetAllStudents, httpCreateStudent, httpUpdateStudent } = require('./students.controller');

const studentsRouter = express.Router();

studentsRouter.get('/', httpGetAllStudents);
studentsRouter.post('/', httpCreateStudent);
studentsRouter.patch('/:id', httpUpdateStudent);

module.exports = studentsRouter;