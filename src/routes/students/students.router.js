const express = require('express');
const { httpGetAllStudents, httpCreateStudent } = require('./students.controller');

const studentsRouter = express.Router();

studentsRouter.get('/', httpGetAllStudents);
studentsRouter.post('/', httpCreateStudent);

module.exports = studentsRouter;