const mongoose = require('mongoose');
const amountSchema = require('../schemas/amount.schema');

const paymentSchema = new mongoose.Schema({
  schoolTerm: {
    type: String,
    required: false,
  },
  concept: {
    type: String,
    required: false,
  },
  billId: {
    type: Number,
    required: false,
  },
  amount: amountSchema,
  discount: {
    type: String,
    required: false,
  },
  isCredit: {
    type: Boolean,
    required: false,
  },
  time: {
    date: {
      type: Date,
      required: false,
    },
    hour: {
      type: String,
      required: false,
    },
    datetime: {
      type: String,
      required: false,
    },
    timezone: {
      type: String,
      required: false,
    },
  },
  cashier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: false,
  },
  payerRefId: {
    type: String,
    required: false,
  },
  payerName: {
    type: String,
    required: false,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: false,
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
