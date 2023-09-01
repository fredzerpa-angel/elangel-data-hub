// Libraries
const path = require('path');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const expressStaticGzip = require("express-static-gzip");
require('dotenv').config();

// Routes
const apiRouter = require('./routes/api/api.router');
const authRouter = require('./routes/auth/auth.router');
const { checkUserAuth } = require('./routes/auth/auth.utils');
const app = express();

// Nos permite el uso concurrente de cliente y el servidor
if (process.env.NODE_ENV === 'development') {
  // Aceptamos requests de otros origenes
  app.use(cors({
    origin: 'http://localhost:3000',
  }))
}

// Transforma requests entrantes con datos tipo JSON
app.use(express.json({ limit: '50mb' })); // Cambiamos el limite para poder obtener decenas de miles de datos JSON, como los pagos
// Transforma requests entrantes con datos tipo Form
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload()); // Middleware usado para recibir los archivos enviados por formulario del cliente. Ex: Fotos

// Creamos una sesion para el usuario logueado y guardamos los datos en una Cookie en el cliente
app.use(cookieParser(process.env.COOKIE_SESSION_SECRET))

app.use(express.static(path.join(__dirname, '..', 'public')));

// Se centraran todas las rutas del servidor (Estudiantes, Pagos, ...) en el ruta '/api'
app.use('/api', checkUserAuth, apiRouter);
app.use('/auth', authRouter); // LogIn, LogOut y Registro de usuario

// Enviamos el Front End a cada endpoint
app.get('/*', expressStaticGzip(path.join(__dirname, '..', 'public')));

module.exports = app;
