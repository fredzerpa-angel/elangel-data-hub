const mongoose = require('mongoose');
const addressSchema = require('../schemas/addresses.schema');
const documentsIdSchema = require('../schemas/documentsId.schema');
const phonesSchema = require('../schemas/phones.schema');

const parentSchema = new mongoose.Schema({
  // Data proveniente de Arcadat
  documentId: {
    type: documentsIdSchema,
    required: false,
    unique: true,
  },
  names: {
    type: String,
    required: false,
  },
  lastnames: {
    type: String,
    required: false,
  },
  fullname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
    unique: true,
  },
  phones: phonesSchema,
  gender: {
    type: String,
    required: false,
  },
  birthdate: {
    type: Date,
    required: false,
  },
  // Se puede tener 1 o mas direcciones
  addresses: {
    type: [addressSchema],
    required: false,
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
