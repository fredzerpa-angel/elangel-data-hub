const express = require('express');

// Routes
const parentsRouter = require('./routes/parents/parents.router');
const paymentsRouter = require('./routes/payments/payments.routes');
const studentsRouter = require('./routes/students/students.router');

const app = express();

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse incoming requests with Form payloads
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use('/students', studentsRouter);
app.use('/parents', parentsRouter);
app.use('/payments', paymentsRouter);

module.exports = app;
