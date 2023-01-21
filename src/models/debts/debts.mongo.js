const mongoose = require('mongoose');
const amountSchema = require('../schemas/amounts.schema');
const documentsIdSchema = require('../schemas/documentsId.schema');

const debtSchema = new mongoose.Schema({
  schoolTerm: {
    type: String,
    required: false,
  },
  student: {
    documentId: documentsIdSchema,
    fullname: {
      type: String,
      required: true
    }
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
      default: true,
    },
    // Creacion de la deuda
    issuedAt: {
      type: Date,
      required: false,
    },
    // Ultima actualizacion de la deuda, usualmente cambiado por un pago, este valor se actualiza por un trigger en MongoDB
    lastUpdate: {
      type: Date,
      required: false,
    },
  },
});

module.exports = mongoose.model('Debt', debtSchema);
