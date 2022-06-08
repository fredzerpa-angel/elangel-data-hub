const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  // Data proveniente de Arcadat
  documentId: {
    type: String,
    required: false,
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
    required: true,
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
  addressOfBirth: {
    type: String,
    required: true,
  },
  currentAddress: {
    type: String,
    required: true,
  },
  phones: {
    main: {
      type: String,
      required: true,
    },
    secondary: {
      type: String,
      required: false,
    },
  },

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
      required: true,
    },
    academic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parent',
      required: true,
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
