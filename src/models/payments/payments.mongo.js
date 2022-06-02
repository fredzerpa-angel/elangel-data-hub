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
  paymentDate: {
    type: Date,
    required: false,
  },
  paymentTime: {
    type: String,
    required: false,
  },
  paymentDatetime: {
    type: String,
    required: false,
  },
  cashier: {
    type: String,
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
  amount: amountSchema,
  discount: {
    type: String,
    required: false,
  },
  isCredit: {
    type: Boolean,
    required: false,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: false,
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
