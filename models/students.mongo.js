const mongoose = require('mongoose');

const studentsSchema = new mongoose.Schema({
  schoolId: {
    type: String,
    required: true
  },
  gradeLevelAttended: {
    type: String,
    required: true
  },
  names: {
    type: String,
    required: true
  },
  lastnames: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  birthdate: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  paymentPlan: {
    type: String,
    required: true
  },
  discountPlan: {
    type: String,
    required: true
  },
  addressOfBirth: {
    type: String,
    required: true
  },
  currentAddress: {
    type: String,
    required: true
  },
  phoneMain: {
    type: String,
    required: true
  },
  phoneSecondary: {
    type: String,
    required: true
  },
  father: {
    type: String,
    required: true
  },
  mother: {
    type: String,
    required: true
  },
  guardian: {
    type: String,
    required: true
  },
});
