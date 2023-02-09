const mongoose = require('mongoose');
const amountSchema = require('../schemas/amounts.schema');
const documentsIdSchema = require('../schemas/documentsId.schema');
const studentSchema = require('../schemas/students.schema');

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
  amount: {
    type: amountSchema,
    required: false,
  },
  // Este valor esta dado en Bs en Arcadat
  discount: {
    type: amountSchema,
    required: false,
  },
  // Credit significa que este pago es un abono
  isCredit: {
    type: Boolean,
    required: false,
  },
  // Que el pago fue anulado
  canceled: {
    type: Boolean,
    default: false,
    required: false,
  },

  time: {
    date: {
      type: String,
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

  paymentHolder: {
    fullname: {
      type: String,
      required: false,
    },
    documentId: documentsIdSchema,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: false,
  },
  cashier: { 
    // TODO: cambiar a usar type: ObjectId cuando se pueda obtener todos los empleados de ARCADAT
    documentId: documentsIdSchema,
    fullname: {
      type: String,
      required: true
    }
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
