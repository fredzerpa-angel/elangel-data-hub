const mongoose = require('mongoose');
const amountSchema = require('../schemas/amounts.schema');

const debtSchema = new mongoose.Schema({
  schoolTerm: {
    type: String,
    required: false,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
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
  concept: {
    type: String,
    required: false,
  },
  amount: amountSchema,
  // Se registraran los pagos adelantados, atrasados y a tiempo respectivos al concepto
  payments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Payment',
    required: false,
  },
  // Estado actual de la deuda
  status: {
    pending: {
      type: Boolean,
      required: false,
    },
    // Ultima actualizacion de la deuda, usualmente cambiado por un pago
    lastUpdate: {
      type: Date,
      required: false,
    },
  },
});

module.exports = mongoose.model('Debt', debtSchema);
