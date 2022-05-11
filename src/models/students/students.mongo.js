const mongoose = require('mongoose');

const studentsSchema = new mongoose.Schema({
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
    type: String,
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
  guardian: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
    required: false,
  },
});

// Connects studentSchema with "Students" collection
module.exports = mongoose.model('Student', studentsSchema);
