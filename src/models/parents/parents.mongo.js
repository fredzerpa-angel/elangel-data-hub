const mongoose = require('mongoose');
const addressSchema = require('../schemas/addresses.schema');
const documentsIdSchema = require('../schemas/documentsId.schema');
const phonesSchema = require('../schemas/phones.schema');

const parentSchema = new mongoose.Schema({
  // Data proveniente de Arcadat
  documentId: {
    type: documentsIdSchema,
    required: true,
    unique: true,
  },
  names: {
    type: String,
    required: true,
  },
  lastnames: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phones: phonesSchema,
  gender: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  // Se puede tener 1 o mas direcciones
  addresses: {
    type: [addressSchema],
    required: true,
  },

  children: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  isParentAdmin: {
    type: Boolean,
    required: false,
  },
  isParentAcademic: {
    type: Boolean,
    required: false,
  },
});

// Conecta parentSchema con "Parents" colleccion
module.exports = mongoose.model('Parent', parentSchema);
