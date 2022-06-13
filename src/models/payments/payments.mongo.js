const mongoose = require('mongoose');
const amountSchema = require('../schemas/amounts.schema');

const paymentSchema = new mongoose.Schema({
  schoolTerm: {
    type: String,
    required: true,
  },
  concept: {
    type: String,
    required: true,
  },
  billId: {
    type: Number,
    required: true,
    unique: true,
  },
  amount: amountSchema,
  discount: {
    type: String,
    required: true,
  },
  isCredit: {
    type: Boolean,
    required: true,
  },
  time: {
    date: {
      type: Date,
      required: true,
    },
    hour: {
      type: String,
      required: true,
    },
    datetime: {
      type: String,
      required: true,
    },
    timezone: {
      type: String,
      required: true,
    },
  },

  payer: {
    fullname: {
      type: String,
      required: true,
    },
    refId: {
      type: String,
      required: true,
    },
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  cashier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
