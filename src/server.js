// Libraries
require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const upsertMany = require('@meanie/mongoose-upsert-many');
mongoose.plugin(upsertMany); // ! Necesita estar antes que app.js (antes que los Routers)

// Components
const app = require('./app');

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

// Mongo Connection
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('open', () => console.log('MongoDB connection ready!'));
mongoose.connection.on('error', console.error);

server.listen(PORT, console.log(`Listening on PORT ${PORT}`));
