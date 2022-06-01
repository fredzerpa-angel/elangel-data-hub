const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  // Data proveniente de Arcadat
  cedulaId: {
    type: String,
    required: false,
  },
  gradeLevelAttended: {
    type: String,
    required: false,
  },
  paymentPlan: {
    type: String,
    required: false,
  },
  discountPlan: {
    type: String,
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
  },
  gender: {
    type: String,
    required: false,
  },
  birthdate: {
    type: Date,
    required: false,
  },
  addressOfBirth: {
    type: String,
    required: false,
  },
  currentAddress: {
    type: String,
    required: false,
  },
  phoneMain: {
    type: String,
    required: false,
  },
  phoneSecondary: {
    type: String,
    required: false,
  },
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
  parentAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
    required: false,
  },
  parentAcademic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
    required: false,
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
