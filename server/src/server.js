// Libraries
require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const upsertMany = require('@meanie/mongoose-upsert-many');
// Agregamos el plugin para poder usar el method en todos los Schemas
mongoose.plugin(upsertMany); // ! Necesita estar antes que app.js (antes que los Routers)

// Services
const { refreshCollections } = require('./services/services');
const { mongoConnect } = require('./services/mongo.services');
// Components
const app = require('./app');

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

// Cargamos los servicios
(async function startServer() {
  await mongoConnect();
  // await refreshCollections();
  server.listen(PORT, console.log(`Listening on PORT ${PORT}`));
})()