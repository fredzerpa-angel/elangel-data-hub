const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
  // Data proveniente de Arcadat
  cedulaId: {
    type: String,
    required: false,
  },
  fullname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  phoneMain: {
    type: String,
    required: false,
  },
  phoneSecondary: {
    type: String,
    required: false,
  },
});

// Conecta studentSchema con "Parents" colleccion
module.exports = mongoose.model('Parent', parentSchema);