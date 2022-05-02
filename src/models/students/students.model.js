const students = require('./students.mongo');

async function getAllStudents() {
  return await students.find({});
}

async function createStudent(studentData) {
  return await students.create(studentData);
}

function updateStudent() {
  // TODO: Actualizar estudiante
}

function deleteStudent() {
  // TODO: Borrar estudiantes de manera administrativa
}

module.exports = {
  getAllStudents,
  createStudent,
};
