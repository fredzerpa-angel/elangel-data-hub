require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', err => console.log('Error on Mongo Atlas DB. Code: ', err.code));
mongoose.connection.once('close', () => {
  console.log('MongoDB connection has been closed!')
});

async function mongoConnect() {
  try {
    await mongoose.connect(MONGODB_URI);
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
