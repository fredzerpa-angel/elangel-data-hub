const express = require('express');
const studentsRouter = require('./routes/students/students.router');

const app = express();

// Parse incoming requests with JSON payloads 
app.use(express.json());

app.use('/students', studentsRouter);

module.exports = app;