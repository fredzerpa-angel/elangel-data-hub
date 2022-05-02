require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');

// VARIABLES
const PORT = process.env.PORT || 8000;
const MONGO_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@clusterangel.ifu9f.mongodb.net/angel?retryWrites=true&w=majority`;

const server = http.createServer(app);

// MONGO CONNECTION
mongoose.connect(MONGO_URI);
mongoose.connection.on('open', () => console.log('MongoDB connection ready!'));
mongoose.connection.on('error', console.error);

server.listen(PORT, console.log(`Listening on PORT ${PORT}`));
