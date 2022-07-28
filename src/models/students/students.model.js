const students = require('./students.mongo');
const ArcadatApi = require('../../api/Arcadat/Arcadat.api');

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
  return await students
    .find()
    .or([
      { fullname: new RegExp(search, 'gi') },
      { documentId: new RegExp(search, 'gi') },
    ]);
}

async function getStudentByDocumentId(documentId) {
  return await students.findOne({ documentId: { number: documentId } });
}

async function updateStudentByDocumentId(documentId, updateData) {
  return await students.findOneAndUpdate({ documentId: { number: documentId } }, updateData);
}

async function upsertStudentsByBundle(bundle) {
  return await students.upsertMany(bundle, {
    matchFields: ['fullname'], // Compara los docs mediante este campo
    ensureModel: true, // Valida la data por el Schema
  });
}

module.exports = {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
  getStudentBySearch,
  getStudentByDocumentId,
  updateStudentByDocumentId,
  upsertStudentsByBundle,
};
