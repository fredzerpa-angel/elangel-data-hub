const mongoose = require('mongoose');
const addressSchema = require('../schemas/addresses.schema');
const documentsIdSchema = require('../schemas/documentsId.schema');
const phonesSchema = require('../schemas/phones.schema');

const parentSchema = new mongoose.Schema({
  // Data proveniente de Arcadat
  documentId: {
    type: documentsIdSchema,
    required: false,
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
    // Chequea que sean valores unicos si no son null
    index: {
      unique: true,
      partialFilterExpression: { email: { $type: 'string' } },
    },
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
    ref: 'Student',
    required: false,
  },
  isParentAdmin: {
    type: Boolean,
    default: false,
    required: false,
  },
  isParentAcademic: {
    type: Boolean,
    default: false,
    required: false,
  },
});

// Conecta parentSchema con "Parents" colleccion
module.exports = mongoose.model('Parent', parentSchema);
