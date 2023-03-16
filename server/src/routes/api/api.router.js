const express = require('express');
const apiRouter = express.Router();

// Routes
const parentsRouter = require('../parents/parents.router');
const paymentsRouter = require('../payments/payments.router');
const studentsRouter = require('../students/students.router');
const debtsRouter = require('../debts/debts.router');
const eventsRouter = require('../events/events.router');
const employeesRouter = require('../employees/employees.router');
const authRouter = require('../auth/auth.router');

apiRouter.use('/students', studentsRouter);
apiRouter.use('/parents', parentsRouter);
apiRouter.use('/payments', paymentsRouter);
apiRouter.use('/debts', debtsRouter);
apiRouter.use('/events', eventsRouter);
apiRouter.use('/employees', employeesRouter);
apiRouter.use('/auth', authRouter);

module.exports = apiRouter;
