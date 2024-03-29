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
  concept: {
    type: String,
    required: false,
  },
  amount: {
    initial: amountSchema, // Es el monto que posee la deuda sin deducciones
    pending: amountSchema, // El monto que viene de ARCADAT, es monto inicial descontando los pagos
  },
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
      type: String,
      required: false,
    },
    // Ultima actualizacion de la deuda, usualmente cambiado por un pago, este valor se actualiza por un trigger en MongoDB
    lastUpdate: {
      type: String,
      required: false,
    },
  },
});

// Eliminamos datos sensibles al enviarlos por nuestro API al cliente
debtSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret._id;
    delete ret.__v;
  }
});


module.exports = mongoose.model('Debt', debtSchema);
