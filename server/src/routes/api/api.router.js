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

// Utils
const { checkStandardPermissions } = require('../auth/auth.utils');

apiRouter.use('/students', checkStandardPermissions, studentsRouter);
apiRouter.use('/parents', checkStandardPermissions, parentsRouter);
apiRouter.use('/payments', checkStandardPermissions, paymentsRouter);
apiRouter.use('/debts', checkStandardPermissions, debtsRouter);
apiRouter.use('/events', checkStandardPermissions, eventsRouter);
apiRouter.use('/employees', checkStandardPermissions, employeesRouter);
apiRouter.use('/auth', authRouter);

module.exports = apiRouter;
