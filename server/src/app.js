// Libraries
const path = require('path');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');

// Routes
const parentsRouter = require('./routes/parents/parents.router');
const paymentsRouter = require('./routes/payments/payments.router');
const studentsRouter = require('./routes/students/students.router');
const debtsRouter = require('./routes/debts/debts.router');
const eventsRouter = require('./routes/events/events.router');
const employeesRouter = require('./routes/employees/employees.router');
const authRouter = require('./routes/auth/auth.router');

const app = express();

// Aceptamos requests de otros origenes
app.use(cors({
  origin: 'http://localhost:3000',
}))

// Transforma requests entrantes con datos tipo JSON
app.use(express.json({ limit: '50mb' })); // Cambiamos el limite para poder obtener decenas de miles de datos JSON, como los pagos
// Transforma requests entrantes con datos tipo Form
app.use(
  express.urlencoded({
    extended: false,
  })
);
// Creamos una sesion para el usuario logueado y guardamos los datos en una Cookie en el cliente
app.use(cookieParser(process.env.COOKIE_SESSION_SECRET))

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/students', studentsRouter);
app.use('/parents', parentsRouter);
app.use('/payments', paymentsRouter);
app.use('/debts', debtsRouter);
app.use('/events', eventsRouter);
app.use('/employees', employeesRouter);
app.use('/auth', authRouter);

// Enviamos el Front End a cada endpoint
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
