const students = require('./students.mongo');

async function getAllStudents() {
  return await students.find({});
}

async function getStudentById(studentId) {
  // TODO
}

async function createStudent(studentData) {
  return await students.create(studentData);
}

async function updateStudent(studentId, updateData) {
  const options = {
    new: true, // Retorna el Estudiante con los datos actualizados
    runValidators: true, // Aplica las validaciones del Student Schema otra vez
  };

  return await students.findByIdAndUpdate(studentId, updateData, options);
}

async function deleteStudent(studentId) {
  return await students.findByIdAndDelete(studentId)
}

module.exports = {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
};
