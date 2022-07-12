const mongoose = require('mongoose');
const addressSchema = require('../schemas/addresses.schema');
const documentsIdSchema = require('../schemas/documentsId.schema');
const phonesSchema = require('../schemas/phones.schema');

const studentSchema = new mongoose.Schema({
  // Data proveniente de Arcadat
  imageUrl: {
    type: String,
    required: false,
  },
  documentId: {
    type: documentsIdSchema,
    required: true,
    unique: true,
  },
  gradeLevelAttended: {
    type: String,
    required: true,
  },
  paymentPlan: {
    type: String,
    required: true,
  },
  discountPlan: {
    type: String,
    required: false,
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
  gender: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  // Se separa de las direcciones tradicionales, ya que es unica
  addressOfBirth: {
    type: addressSchema,
    required: true,
  },
  // Se puede tener 1 o mas direcciones
  addresses: {
    type: [addressSchema],
    required: true,
  },
  phones: phonesSchema,

  parents: {
    father: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parent',
      required: false,
    },
    mother: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parent',
      required: false,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parent',
      required: false,
    },
    academic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parent',
      required: false,
    },
  },

  // Domiciliación
  directDebit: {
    id: {
      type: String,
      required: false,
    },
    code: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    account: {
      type: Number,
      required: false,
    },
  },

  // Nueva data
  payments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Payment',
    required: false,
  },
  debts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Debt',
    required: false,
  },
});

// Conecta studentSchema con "Students" colleccion
module.exports = mongoose.model('Student', studentSchema);
