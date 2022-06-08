const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  _id: false, // New Schema creates _id property
  full: {
    type: String,
    required: true,
  },
  parts: {
    house: {
      type: String,
      required: false,
    },
    street: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    postalCode: {
      type: Number,
      required: false,
    },
  },
  geo: {
    lat: {
      type: String,
      required: false,
    },
    lon: {
      type: String,
      required: false,
    },
  },
});

module.exports = addressSchema;
