const { DateTime } = require('luxon');
const ArcadatApi = require('../api/Arcadat/Arcadat.api');
const { getAllDebts, createDebt } = require('../models/debts/debts.model');
const { upsertParentsByBundle } = require('../models/parents/parents.model');
const { getAllPayments, updatePayment, createPaymentsByBundle } = require('../models/payments/payments.model');
const { addDebtToStudentByDocumentId, deleteDebtFromStudentByDocumentId, addPaymentToStudentByDocumentId, upsertStudentsByBundle, getAllStudents } = require('../models/students/students.model');
const { upsertEmployeesByBundle } = require('../models/employees/employees.model');
const { MOCKUP_ARCADAT_API_STUDENTS, MOCKUP_MONGO_DB_STUDENTS } = require('./mockup');


async function updateStudentsCollection() {
  const currentStudents = await ArcadatApi.getStudents();
  const oldStudents = await getAllStudents();
}

async function updateParentsCollection() {
  // TODO: Agregar Padres Administrativos
  const currentAcademicParents = await ArcadatApi.getAcademicParents();
  return await upsertParentsByBundle(currentAcademicParents);
}

async function updatePaymentsCollection() {
  const currentPayments = await ArcadatApi.getPayments();
  const oldPayments = await getAllPayments();
}

async function updateDebtsCollection() {
  const currentDebts = await ArcadatApi.getPendingDebts();
  const oldDebts = await getAllDebts();
}

async function updateEmployeesCollection() {
  const currentEmployees = await ArcadatApi.getEmployees();
  return await upsertEmployeesByBundle(currentEmployees);
}

async function refreshCollections() {
  try {
    console.log('Starting refreshing Collections..');
    // const studentsRefresh = await updateStudentsCollection();
    // const parentsRefresh = await updateParentsCollection();
    // const paymentsRefresh = await updatePaymentsCollection();
    // const debtsRefresh = await updateDebtsCollection();
    // const employeesRefresh = await updateEmployeesCollection();
    console.log('Done refreshing Collections.');
  } catch (err) {
    console.log('Error refreshing the collections.', err.message);
  }
}

module.exports = {
  refreshCollections,
};
