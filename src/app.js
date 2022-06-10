const express = require('express');

// Routes
const parentsRouter = require('./routes/parents/parents.router');
const paymentsRouter = require('./routes/payments/payments.router');
const studentsRouter = require('./routes/students/students.router');
const debtsRouter = require('./routes/debts/debts.router');

const app = express();

// Parse incoming requests with JSON payloads
app.use(express.json({limit: '50mb'}));

// Parse incoming requests with Form payloads
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use('/students', studentsRouter);
app.use('/parents', parentsRouter);
app.use('/payments', paymentsRouter);
app.use('/debts', debtsRouter);

module.exports = app;
