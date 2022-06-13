const mongoose = require('mongoose');
const amountSchema = require('../schemas/amounts.schema');

const debtSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  father: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
    required: true,
  },
  mother: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
    required: true,
  },
  parentAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
    required: true,
  },
  concept: {
    type: String,
    required: true,
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
      required: true,
    },
    // Ultima actualizacion de la deuda, usualmente cambiado por un pago
    lastUpdate: {
      type: Date,
      required: true,
    },
  },
});

module.exports = mongoose.model('Debt', debtSchema);
