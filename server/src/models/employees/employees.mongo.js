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
    required: true,
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
    type: String,
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
  phones: {
    type: phonesSchema,
    required: false,
  },
  status: {
    type: String,
    required: false,
  }
});

// Eliminamos datos sensibles al enviarlos por nuestro API al cliente
employeeSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret._id;
    delete ret.__v;
  }
});


// Conecta employeeSchema con "Employees" collection
module.exports = mongoose.model('Employee', employeeSchema);
