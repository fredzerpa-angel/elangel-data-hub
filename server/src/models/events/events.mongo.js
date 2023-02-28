const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
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
    required: true,
  },
  goal: {
    type: String,
    required: true,
  },
  participants: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Student',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: false,
  },
  observations: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Event', eventSchema);
