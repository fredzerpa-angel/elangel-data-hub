const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
  // Data proveniente de Arcadat
  documentId: {
    type: String,
    required: false,
    unique: true,
  },
  fullname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
    unique: true,
  },
  phoneMain: {
    type: String,
    required: false,
  },
  phoneSecondary: {
    type: String,
    required: false,
  },

  // Nueva data
  children: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  isParentAdmin: {
    type: Boolean,
    required: false,
  },
  isParentAcademic: {
    type: Boolean,
    required: false
  }
});

// Conecta parentSchema con "Parents" colleccion
module.exports = mongoose.model('Parent', parentSchema);
