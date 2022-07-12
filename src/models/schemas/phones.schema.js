const mongoose = require('mongoose');

const phonesSchema = new mongoose.Schema({
  _id: false, // New Schema crea _ids
  main: {
    type: String,
    required: true,
  },
  secondary: {
    type: String,
    required: false,
  },
})

module.exports = phonesSchema;