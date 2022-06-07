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
    unique: true,
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
  phones: {
    main: {
      type: String,
      required: false,
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
      required: false,
    },
    academic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parent',
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
