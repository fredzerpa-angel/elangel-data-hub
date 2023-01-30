const students = require('./students.mongo');

async function getAllStudents() {
  return await students.find().lean();
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
    ]).lean();
}

async function getStudentByDocumentId(documentId) {
  return await students.findOne({ 'documentId.number': documentId });
}

async function addPaymentToStudentByDocumentId(documentId, payment) {
  // Tomamos la data que queremos pasar del pago
  const data = payment.id;
  return await students.updateOne({ 'documentId.number': documentId }, { $addToSet: { payments: data } })
}

async function deletePaymentFromStudentByDocumentId(documentId, payment) {
  // Tomamos el valor que removera del array Payments
  const filter = payment.id;
  return await students.updateOne({ 'documentId.number': documentId }, { $pull: { payments: filter } })
}

async function addDebtToStudentByDocumentId(documentId, debt) {
  // Tomamos la data que queremos pasar de la deuda
  const data = debt.id;
  return await students.updateOne({ 'documentId.number': documentId }, { $addToSet: { debts: data } })
}

async function deleteDebtFromStudentByDocumentId(documentId, debt) {
  // Tomamos el valor que removera del array Debts
  const filter = debt.id;
  return await students.updateOne({ 'documentId.number': documentId }, { $pull: { debts: filter } })
}

async function updateStudentByDocumentId(documentId, updateData) {
  return await students.findOneAndUpdate({ 'documentId.number': documentId }, updateData);
}

async function upsertStudentsByBundle(bundle) {
  return await students.upsertMany(bundle, {
    matchFields: ['_id'], // Compara los docs mediante este campo
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
  addDebtToStudentByDocumentId,
  deleteDebtFromStudentByDocumentId,
  addPaymentToStudentByDocumentId,
  deletePaymentFromStudentByDocumentId
};
