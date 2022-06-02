const mongoose = require('mongoose');

const amountSchema = new mongoose.Schema({
  _id: false, // New Schema creates _id property
  // Moneda Venezolana
  bs: {
    type: Number,
    required: false,
  },
  // Moneda de Estados Unidos
  usd: {
    type: Number,
    required: false,
  },
  convertionRate: {
    type: Number,
    required: false,
  },
});
module.exports = amountSchema;