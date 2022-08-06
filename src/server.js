// Libraries
require('dotenv').config();
const http = require('http');
// Services
const { refreshCollections } = require('./services/services');
const { mongoConnect } = require('./services/mongo.services');
// Components
const app = require('./app');

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

// DB Connection
(async function startServer() {
  await mongoConnect();
  await refreshCollections();
})()

server.listen(PORT, console.log(`Listening on PORT ${PORT}`));
