const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  organization: {
    type: String,
    required: true,
  },
  overseers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Employee',
    required: false,
  },
  goal: {
    type: String,
    required: false,
  },
  participants: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Student',
    required: false,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: false,
  },
  observations: {
    type: String,
    required: false,
  },
  createdBy: {
    type: {
      _id: false, // No cree un _id
      // Users Schema. Existe otras cuentas 
      imageUrl: String,
      email: String,
      fullname: String,
      names: String,
      lastnames: String,
    },
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  updates: {
    _id: false, // No cree un _id
    type: [{
      issuedBy: {
        // Users Schema. Existe otras cuentas 
        imageUrl: String,
        email: String,
        fullName: String,
        names: String,
        lastnames: String,
      },
      issuedAt: Date
    }],
    required: false,
  }
});

module.exports = mongoose.model('Event', eventSchema);
