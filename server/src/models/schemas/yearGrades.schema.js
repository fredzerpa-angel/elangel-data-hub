const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  _id: false, // New Schema creates _id property
  subject: {
    code: String,
    name: String,
  },
  grade: String,
})

const yearGradeSchema = new mongoose.Schema({
  _id: false, // New Schema creates _id property
  schoolTerm: String, // Periodo escolar
  stages: { // Stages son los lapsos escolares
    first: {
      section: String, // Seccion del estudiante 'A', 'B' o 'U'
      subjects: [subjectSchema],
    },
    second: {
      section: String,
      subjects: [subjectSchema],
    },
    third: {
      section: String,
      subjects: [subjectSchema],
    },
  },
});

module.exports = yearGradeSchema;