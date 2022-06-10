const mongoose = require('mongoose');

const documentsIdSchema = new mongoose.Schema({
  _id: false, // New Schema creates _id property
  // Los tipos usualmente son: Cedula o Pasaporte
  type: {
    type: String,
    required: true,
  },
  // Numero de la Cedula o Pasaporte
  number: {
    type: Number,
    required: true,
  },
});

module.exports = documentsIdSchema;