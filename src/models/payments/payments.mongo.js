const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  schoolTerm: {
    type: String,
    required: false
  },
  concept: {
    type: String,
    required: false
  },
  billId: {
    type: Number,
    required: false
  },
  paymentDate: {
    type: Date,
    required: false
  },
  paymentTime: {
    type: String,
    required: false
  },
  paymentDatetime: {
    type: String,
    required: false
  },
  cashier: {
    type: String,
    required: false
  },
  payerRefId: {
    type: String,
    required: false
  },
  payerName: {
    type: String,
    required: false
  },
  amountBs: {
    type: mongoose.Types.Decimal128,
    required: false
  },
  amountUsd: {
    type: mongoose.Types.Decimal128,
    required: false
  },
  moneyConvertionRate: {
    type: mongoose.Types.Decimal128,
    required: false
  },
  dataDiscount: {
    type: String,
    required: false
  },
  isCredit: {
    type: Boolean,
    required: false
  },
  studentCedulaId: {
    type: String,
    required: false
  },
  studentFullname: {
    type: String,
    required: false
  },
});

module.exports = mongoose.model('Payment', paymentSchema);