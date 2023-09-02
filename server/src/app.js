// Libraries
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const compression = require('compression'); // Comprime los archivos al mandarlos al cliente
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const fallback = require('express-history-api-fallback'); // 
require('dotenv').config();

// Routes
const apiRouter = require('./routes/api/api.router');
const authRouter = require('./routes/auth/auth.router');
const { checkUserAuth } = require('./routes/auth/auth.utils');
const app = express();

app.use(helmet());

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

app.use(compression()); // Envia los archivos al cliente comprimidos

// Se centraran todas las rutas del servidor (Estudiantes, Pagos, ...) en el ruta '/api'
app.use('/api', checkUserAuth, apiRouter);
app.use('/auth', authRouter); // LogIn, LogOut y Registro de usuario

// Enviamos el Front End a cada endpoint
const root = path.join(__dirname, '..', 'public'); // Path de la carpeta del Build hecho por React
app.use(express.static(root));
app.use(fallback('index.html', { root }));

module.exports = app;
