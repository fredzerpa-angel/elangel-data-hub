const mongoose = require('mongoose');
const addressSchema = require('../schemas/addresses.schema');
const documentsIdSchema = require('../schemas/documentsId.schema');
const phonesSchema = require('../schemas/phones.schema');

const employeeSchema = new mongoose.Schema({
  // Data proveniente de Arcadat
  imageUrl: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  documentId: {
    type: documentsIdSchema,
    required: false,
    // Chequea que sean valores unicos si no son null
    index: {
      partialFilterExpression: { documentId: { number: { $type: 'number' } } },
      unique: true,
    },
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
    required: true,
    unique: true,
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
  gender: {
    type: String,
    required: false,
  },
  birthdate: {
    type: Date,
    required: false,
  },
  // Se separa de las direcciones tradicionales, ya que es unica
  addressOfBirth: {
    type: addressSchema,
    required: false,
  },
  // Se puede tener 1 o mas direcciones
  addresses: {
    type: [addressSchema],
    required: false,
  },
  phones: phonesSchema,
});

// Conecta employeeSchema con "Employees" collection
module.exports = mongoose.model('Employee', employeeSchema);
