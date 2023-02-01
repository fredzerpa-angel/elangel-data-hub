const mongoose = require('mongoose');
const studentSchema = require('../schemas/students,schema');

// Conecta studentSchema con "Students" colleccion
module.exports = mongoose.model('Student', studentSchema);
