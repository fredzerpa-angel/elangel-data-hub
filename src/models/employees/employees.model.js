const employees = require('./employees.mongo');

async function getAllEmployees() {
  return await employees.find({});
}

async function createEmployee(employeeData) {
  return await employees.create(employeeData);
}

async function updateEmployee(employeeId, updateData) {
  const options = {
    new: true, // Retorna el Estudiante con los datos actualizados
    runValidators: true, // Aplica las validaciones del Employee Schema otra vez
  };

  return await employees.findByIdAndUpdate(employeeId, updateData, options);
}

async function deleteEmployee(employeeId) {
  return await employees.findByIdAndDelete(employeeId);
}

async function getEmployeeById(employeeId) {
  return await employees.findById(employeeId);
}

async function getEmployeeBySearch(search) {
  return await employees
    .find()
    .or([
      { fullname: new RegExp(search, 'gi') },
      { documentId: new RegExp(search, 'gi') },
    ]);
}

async function getEmployeeByDocumentId(documentId) {
  return await employees.findOne({ documentId: { number: documentId } });
}

async function updateEmployeeByDocumentId(documentId, updateData) {
  return await employees.findOneAndUpdate({ documentId: { number: documentId } }, updateData);
}

async function upsertEmployeesByBundle(bundle) {
  return await employees.upsertMany(bundle, {
    matchFields: ['fullname'], // Compara los docs mediante este campo
    ensureModel: true, // Valida la data por el Schema
  });
}

module.exports = {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployeeBySearch,
  getEmployeeByDocumentId,
  updateEmployeeByDocumentId,
  upsertEmployeesByBundle,
};
