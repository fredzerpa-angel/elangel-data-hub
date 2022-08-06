const mongoose = require('mongoose');
const upsertMany = require('@meanie/mongoose-upsert-many');
require('dotenv').config()

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', console.error);
mongoose.connection.once('close', () => {
  console.log('MongoDB connection has been closed!')
});

async function mongoConnect() {
  try {
    mongoose.plugin(upsertMany); // ! Necesita estar antes que app.js (antes que los Routers)
    await mongoose.connect(MONGO_URL);
  } catch (error) {
    throw new Error('Failed to connect to Mongo Atlas DB', error);
  }
}

async function mongoDisconnect() {
  try {
    await mongoose.disconnect();
  } catch (error) {
    throw new Error('Could not disconnect Mongo DB', error);
  }
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
