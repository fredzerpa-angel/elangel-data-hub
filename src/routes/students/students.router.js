const express = require('express');
const { httpGetAllStudents } = require('./students.controller');

const studentsRouter = express.Router();

studentsRouter.get('/', httpGetAllStudents);

module.exports = studentsRouter;