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
  amount: {
    type: amountSchema,
    required: true,
  },
  // Este valor esta dado en Bs en Arcadat
  discount: {
    type: amountSchema,
    required: true,
  },
  // Credit significa que este pago es un abono
  isCredit: {
    type: Boolean,
    required: true,
  },
  // Que el pago fue anulado
  canceled: {
    type: Boolean,
    default: false,
    required: true,
  },

  time: {
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    datetime: {
      type: String,
      required: true,
    },
    timezone: {
      type: String,
      default: 'America/Caracas',
      required: true,
    },
  },

  paymentHolder: {
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
