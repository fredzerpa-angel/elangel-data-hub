const students = require('./students.mongo');

async function getAllStudents() {
  return await students.find({});
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
  return await students.findByIdAndDelete(studentId);
}

async function getStudentById(studentId) {
  return await students.findById(studentId);
}

async function getStudentBySearch(search) {
  return await students.find()
  .or([
    { fullname: new RegExp(search, 'gi') },
    { cedulaId: new RegExp(search, 'gi') },
  ]);
}

module.exports = {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
  getStudentBySearch,
};
