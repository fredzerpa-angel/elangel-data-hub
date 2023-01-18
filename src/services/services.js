const ArcadatApi = require('../api/Arcadat/Arcadat.api');
const { getAllDebts } = require('../models/debts/debts.model');
const { upsertParentsByBundle } = require('../models/parents/parents.model');
const { getAllPayments } = require('../models/payments/payments.model');
const { upsertStudentsByBundle, getAllStudents } = require('../models/students/students.model');
const { upsertEmployeesByBundle } = require('../models/employees/employees.model');

async function updateStudentsCollection() {
  const [currentStudents, oldStudents] = await Promise.all([ArcadatApi.getStudents(), getAllStudents()]);

  // isActive es falso, ya que no sabemos si sigue activo o no hasta que se verifique con Arcadat API
  const INITIAL_STUDENTS_DATA = oldStudents.map(student => ({ ...student, isActive: false }));

  // Esta variable contendra todos los estudiantes de manera unica ...
  // ... registrando los estudiantes no cursantes actualmente como no activos
  // ... es necesario debido al propenso cambio de cedula y/o nombre del estudiante ...
  // ... ocasianando duplicacion en la creacion de documentos.
  const studentsUpdatedData = currentStudents.reduce((studentsUpdatedData, studentCurrentData) => {
    // Buscamos si el estudiante ya fue registrado. El nombre o su cedula es propenso a cambios
    const { studentFound, studentFoundIndex } = studentsUpdatedData.reduce((state, student, idx) => {
      // ! Esta validacion solo aplica si tanto la propiedad 'fullname' como 'documentId.number' no han cambiado al mismo tiempo
      const isSameStudent = (student?.fullname === studentCurrentData.fullname) || (student?.documentId?.number === studentCurrentData.documentId.number)
      if (isSameStudent) {
        state.studentFound = student;
        state.studentFoundIndex = idx;
      }
      return state;
    }, { studentFound: null, studentFoundIndex: undefined });

    // Si existe lo actualizamos, si no existe lo agregamos
    studentFound ?
      studentsUpdatedData.splice(studentFoundIndex, 1, { ...studentFound, ...studentCurrentData })
      :
      studentsUpdatedData.push(studentCurrentData)

    return studentsUpdatedData;
  }, INITIAL_STUDENTS_DATA)

  const response = await upsertStudentsByBundle(studentsUpdatedData);
  return response;
}

async function updateParentsCollection() {
  const currentParents = await ArcadatApi.getParents();

  return await upsertParentsByBundle(currentParents);
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

    const studentsRefresh = await updateStudentsCollection();
    console.log(`
    Collection: Students
      ${studentsRefresh.nUpserted} added. 
      ${studentsRefresh.nMatched} checked. 
      ${studentsRefresh.nModified} updated.
    `);

    const parentsRefresh = await updateParentsCollection();
    console.log(`
    Collection: Parents
      ${parentsRefresh.nUpserted} added. 
      ${parentsRefresh.nMatched} checked. 
      ${parentsRefresh.nModified} updated.
    `);

    // const paymentsRefresh = await updatePaymentsCollection();

    // const debtsRefresh = await updateDebtsCollection();

    const employeesRefresh = await updateEmployeesCollection();
    console.log(`
    Collection: Employees
      ${employeesRefresh.nUpserted} added. 
      ${employeesRefresh.nMatched} checked. 
      ${employeesRefresh.nModified} updated.
    `);

    console.log('Done refreshing Collections.');
  } catch (err) {
    console.log('Error refreshing the collections.', err.message);
  }
}

module.exports = {
  refreshCollections,
};
