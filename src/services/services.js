const ArcadatApi = require('../api/Arcadat/Arcadat.api');
const { getAllDebts, upsertDebtsByBundle } = require('../models/debts/debts.model');
const { upsertParentsByBundle } = require('../models/parents/parents.model');
const { upsertPaymentsByBundle } = require('../models/payments/payments.model');
const { upsertStudentsByBundle, getAllStudents } = require('../models/students/students.model');
const { upsertEmployeesByBundle } = require('../models/employees/employees.model');
const { DateTime } = require('luxon');

async function updateStudentsCollection() {
  const [currentStudents, oldStudents] = await Promise.all([ArcadatApi.getStudents(), getAllStudents()]);

  // Creamos un valor inicial de los Estudiantes en la BD para enlazarlas con las estudiantes Activos en Arcadat
  const INITIAL_STUDENTS_DATA = oldStudents.map(student => {
    // isActive es falso, ya que no sabemos si sigue activo o no hasta que se verifique con Arcadat API
    student.isActive = false;
    return student;
  });

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
  const payments = await ArcadatApi.getPayments();

  return await upsertPaymentsByBundle(payments);
}

async function updateDebtsCollection() {
  const [currentDebts, oldDebts] = await Promise.all([ArcadatApi.getPendingDebts(), getAllDebts()]);


  // Creamos un valor inicial de las deudas traidas de la BD para enlazarlas con las deudas pendientes en Arcadat
  const DEBTS_MAP = new Map(oldDebts?.map(debt => {
    debt.status.pending = false; // Ya que no sabemos si aun sigue vigente
    // Creamos una llave unica para identificar cada deuda
    const key = debt.schoolTerm + debt.student.fullname + debt.concept;
    return [key, debt];
  }));

  // Buscamos todas las deudas 
  const debtsDataUpdated = [...currentDebts.reduce((updatedDebts, debt) => {

    debt.status.pending = true; // Ya que aun sigue vigente

    // Creamos una llave unica para identificar cada deuda
    const key = debt.schoolTerm + debt.student.fullname + debt.concept;

    // Agregamos/actualizamos las deudas vigentes
    updatedDebts.set(key, debt);

    return updatedDebts;
  }, DEBTS_MAP).values()]


  return await upsertDebtsByBundle(debtsDataUpdated);
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

    const paymentsRefresh = await updatePaymentsCollection();
    console.log(`
    Collection: Payments
      ${paymentsRefresh.nUpserted} added. 
      ${paymentsRefresh.nMatched} checked. 
      ${paymentsRefresh.nModified} updated.
    `);

    const debtsRefresh = await updateDebtsCollection();
    console.log(`
    Collection: Debts
      ${debtsRefresh.nUpserted} added. 
      ${debtsRefresh.nMatched} checked. 
      ${debtsRefresh.nModified} updated.
    `);

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
