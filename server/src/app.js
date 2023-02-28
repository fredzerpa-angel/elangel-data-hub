// Libraries
const express = require('express');

// Routes
const parentsRouter = require('./routes/parents/parents.router');
const paymentsRouter = require('./routes/payments/payments.router');
const studentsRouter = require('./routes/students/students.router');
const debtsRouter = require('./routes/debts/debts.router');
const eventsRouter = require('./routes/events/events.router');
const employeesRouter = require('./routes/employees/employees.router');

const app = express();
// Transforma requests entrantes con datos tipo JSON
app.use(express.json({ limit: '50mb' }));
// Transforma requests entrantes con datos tipo Form
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use('/students', studentsRouter);
app.use('/parents', parentsRouter);
app.use('/payments', paymentsRouter);
app.use('/debts', debtsRouter);
app.use('/events', eventsRouter);
app.use('/employees', employeesRouter);

module.exports = app;
