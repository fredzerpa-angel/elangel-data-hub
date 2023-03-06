require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const { uploadFileToBucket } = require('../api/AWS/AWS.api');
const { dumpDatabase } = require('../api/MongoDB/MongoDB.api');
const { removeFile } = require('../utils/functions.utils');

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

async function mongoDumpDB() {
  try {

    const dumpResponse = dumpDatabase({
      filePrefix: 'db-elangel',
      pathToDumpFolder: path.join(__dirname, '..', 'temp-backups', 'MongoDB'),
      database: 'el-angel',
    })

    const uploadBackupResponse = await uploadFileToBucket({
      filePath: dumpResponse.data.filePath,
    })

    if (uploadBackupResponse.ok) removeFile(dumpResponse.data.filePath);

    console.log(`Dumped Backup File ${uploadBackupResponse.file} on AWS.`);
  } catch (err) {
    console.log('Error on Database Backup Service: ', err.message);
  }
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
  mongoDumpDB,
};
