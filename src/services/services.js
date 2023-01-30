const ArcadatApi = require('../api/Arcadat/Arcadat.api');
const { getAllDebts, upsertDebtsByBundle } = require('../models/debts/debts.model');
const { upsertParentsByBundle } = require('../models/parents/parents.model');
const { upsertPaymentsByBundle } = require('../models/payments/payments.model');
const { upsertStudentsByBundle, getAllStudents, getStudentByDocumentId } = require('../models/students/students.model');
const { upsertEmployeesByBundle } = require('../models/employees/employees.model');
const { DateTime } = require('luxon');

async function updateStudentsCollection() {
  const [currentStudents, oldStudents] = await Promise.all([ArcadatApi.getStudents(), getAllStudents()]);

  // Creamos un valor inicial de los Estudiantes en la BD para enlazarlas con los estudiantes Activos en Arcadat
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
      // Agregamos un _id para permitirnos enlazar los estudiantes (hermanos) sin agregarlos primero a la BD
      studentsUpdatedData.push(studentCurrentData)

    return studentsUpdatedData;
  }, INITIAL_STUDENTS_DATA)

  return await upsertStudentsByBundle(studentsUpdatedData);
}

async function updateParentsCollection() {
  const currentParents = await ArcadatApi.getParents();

  // Enlazamos los hijos y padres
  const parentsToUpdate = await Promise.all(currentParents.map(async parent => {
    const childrenData = await Promise.all(parent.children.map(async student => {
      
      return await getStudentByDocumentId(student.documentId.number)
    }))
    parent.children = childrenData;
    
    return parent;
  }));

  return await upsertParentsByBundle(parentsToUpdate);
}

async function updatePaymentsCollection() {
  const payments = await ArcadatApi.getPayments();

  const filterDate = DateTime.now().minus({ days: 30 }); // Buscamos los pagos con un maximo de 30 dias de antiguedad
  const paymentsFilteredByDate = payments.filter(({ time: { date } }) => (
    DateTime.fromFormat(date, 'D').diff(filterDate, 'days').as('days') >= 0
  ));

  return await upsertPaymentsByBundle(paymentsFilteredByDate);
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

const refreshedCollectionMessage = (collectionName = '', refreshResponse = {}) => {
  console.log(`
  Collection: ${collectionName}
    ${refreshResponse?.nUpserted} added. 
    ${refreshResponse?.nMatched} checked. 
    ${refreshResponse?.nModified} updated.
  `);
}

async function refreshCollections() {
  try {
    console.log('Starting refreshing Collections..');

    const studentsRefresh = await updateStudentsCollection();
    refreshedCollectionMessage('Students', studentsRefresh);

    const parentsRefresh = await updateParentsCollection();
    refreshedCollectionMessage('Parents', parentsRefresh);

    const paymentsRefresh = await updatePaymentsCollection();
    refreshedCollectionMessage('Payments', paymentsRefresh);

    const debtsRefresh = await updateDebtsCollection();
    refreshedCollectionMessage('Debts', debtsRefresh);

    const employeesRefresh = await updateEmployeesCollection();
    refreshedCollectionMessage('Employees', employeesRefresh);

    console.log('Done refreshing Collections.');
  } catch (err) {
    console.log('Error refreshing the collections.', err.message);
  }
}

module.exports = {
  refreshCollections,
};
