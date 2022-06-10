const mongoose = require('mongoose');
const documentsIdSchema = require('../schemas/documentsId.schema');

const parentSchema = new mongoose.Schema({
  // Data proveniente de Arcadat
  documentId: {
    type: String,
    required: true,
    unique: true,
  },
  names: {
    type: String,
    required: true,
  },
  lastnames: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phones: {
    main: {
      type: String,
      required: true,
    },
    secondary: {
      type: String,
      required: false,
    },
  },
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
    required: false,
  },
});

// Conecta parentSchema con "Parents" colleccion
module.exports = mongoose.model('Parent', parentSchema);
