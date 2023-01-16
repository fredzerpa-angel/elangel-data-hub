const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const ArcadatApi = require('../api/Arcadat/Arcadat.api');
const { getAllDebts, createDebt } = require('../models/debts/debts.model');
const { upsertParentsByBundle, getParentByDocumentId, addChildToParentByDocumentId } = require('../models/parents/parents.model');
const { getAllPayments, updatePayment, createPaymentsByBundle } = require('../models/payments/payments.model');
const { addDebtToStudentByDocumentId, deleteDebtFromStudentByDocumentId, addPaymentToStudentByDocumentId, upsertStudentsByBundle, getAllStudents, getStudentByDocumentId } = require('../models/students/students.model');
const { upsertEmployeesByBundle } = require('../models/employees/employees.model');


async function updateParentsCollection() {
  // TODO: Agregar Padres Administrativos
  const currentAcademicParents = await ArcadatApi.getAcademicParents();

  return await upsertParentsByBundle(currentAcademicParents);
}

async function updateStudentsCollection() {
  const currentStudents = await ArcadatApi.getStudents();
  const oldStudents = await getAllStudents();

  // ! Este paso es necesario para recobrar la informacion de previa del estudiante, ya que esta se borra durante el upsert
  // Incluimos los pagos y deudas a la nueva data de Arcadat
  currentStudents.forEach(student => {
    const studentFormerData = oldStudents.find(oldStudent => oldStudent.fullname === student.fullname);
    // Si hay data preexistente del estudiante, la pasamos al la nueva data del estudiante 
    if (studentFormerData) {
      student.id = studentFormerData.id;
      student.payments = studentFormerData.payments;
      student.debts = studentFormerData.debts;
    } else {
      student.id = new mongoose.Types.ObjectId();
    }
  })

  // Enlazamos los estudiantes y padres (Obtener el ObjectId de los padres para los estudiantes)
  const studentsWithParentsLinks = currentStudents.map(async student => {
    const parentsEntries = Object.entries(student.parents);
    const parentsWithLinksEntries = parentsEntries.map(
      async ([parentType, parentData]) => {    
        const parent = await addChildToParentByDocumentId(parentData.documentId.number, student);
        return [parentType, parent?.id];
      }
    );


    // async~await retorna un Promise, por lo que es necesario que en cada uno de los items del Array se use await
    let parentsWithLinks = []
    for (const parentEntry of parentsWithLinksEntries) {
      parentsWithLinks.push(await parentEntry);
    }

    return { ...student, parents: Object.fromEntries(parentsWithLinks) };
  });

  // async~await retorna un Promise, por lo que es necesario que en cada uno de los items del Array se use await
  let studentsLinkedWithParents = [];
  for (const studentLinked of studentsWithParentsLinks) {
    studentsLinkedWithParents.push(await studentLinked);
  }
    
  return await upsertStudentsByBundle(studentsLinkedWithParents);
}

async function updatePaymentsCollection() {
  const currentPayments = await ArcadatApi.getPayments();
  const oldPayments = await getAllPayments();

  const records = {
    old: new Map()
  }

  oldPayments.forEach(payment => {
    // Creamos una llave unica para identificar cada pago
    const key = payment.concept + payment.billId + payment.student.documentId.number + payment.paymentHolder.refId;

    records.old.set(key, payment);
  })

  // Revisamos si algun pago fue cancelado
  currentPayments.forEach(payment => {

    const daysPassedSincePay = Math.abs(DateTime.fromISO(payment.time.date).diffNow('days'));
    // Tomamos los pagos de los ultimos 7 dias, ya que dentro de los 7 dias se cancela o no el pago
    if (daysPassedSincePay < 7) {
      // Creamos una llave unica para identificar cada pago
      const key = payment.concept + payment.billId + payment.student.documentId.number + payment.paymentHolder.refId;

      // No es un pago nuevo
      if (records.old.has(key)) {
        // Data del pago cuando fue registrado
        const { id, canceled } = records.old.get(key);
        canceled ? updatePayment(id, { canceled }) : null;
      }
    }
  })

  // Revisamos si tiene algun pago nuevo y lo agregamos
  const paymentsAmountDifference = currentPayments.length - oldPayments.length;
  if (paymentsAmountDifference > 0) {
    const newPayments = currentPayments.slice(oldPayments.length); // Creamos un array de solo los pagos nuevos
    const newPaymentsCreated = await createPaymentsByBundle(newPayments);
    newPaymentsCreated.forEach(async paymentCreated => {
      const studentDocumentId = paymentCreated.student.documentId.number;
      const addPaymentToStudentResponse = await addPaymentToStudentByDocumentId(studentDocumentId, paymentCreated);
    });
  }

  return { nInserted: paymentsAmountDifference, total: currentPayments.length }
}

async function updateDebtsCollection() {
  const currentDebts = await ArcadatApi.getPendingDebts();
  const oldDebts = await getAllDebts();

  // Creamos un registro para poder manejar los cambios en las deudas
  const records = { // Registro de deudas
    old: new Map(),
    new: new Map()
  }

  oldDebts.forEach(debt => {
    // Creamos una llave unica para identificar cada deuda
    const key = debt.schoolTerm + debt.concept + debt.student.fullname + debt.status.issuedAt;

    records.old.set(key, debt);
  })

  currentDebts.forEach(async debt => {
    // Creamos una llave unica para identificar cada deuda
    const key = debt.schoolTerm + debt.concept + debt.student.fullname + debt.status.issuedAt;
    // Agregamos la deuda a nuestros registros
    records.new.set(key, debt);

    // Si no esta guardada en el record, es porque la deuda es nueva
    if (!records.old.has(key)) {

      // Creamos la deuda
      const createdDebt = await createDebt(debt);

      // Agregamos la deuda al estudiante
      const studentDocumentId = debt.student.documentId.number;
      const addDebtToStudentResponse = await addDebtToStudentByDocumentId(studentDocumentId, createdDebt);
    }

  })

  // Comparamos los registros para encontrar las deudas ya pagadas
  records.old.forEach(async (oldDebt, oldDebtKey) => {
    const studentDocumentId = oldDebt.student.documentId.number;

    // Eliminamos cualquier deuda que ya haya sido pagada
    if (!records.new.has(oldDebtKey)) await deleteDebtFromStudentByDocumentId(studentDocumentId, oldDebt);
  })

  return { total: currentDebts.length }

}

async function updateEmployeesCollection() {
  const currentEmployees = await ArcadatApi.getEmployees();

  return await upsertEmployeesByBundle(currentEmployees);
}

async function refreshCollections() {
  try {
    console.log('Start refreshing Collections..');
    const parentsRefresh = await updateParentsCollection();
    console.log(`${parentsRefresh.nUpserted} Parents added. ${parentsRefresh.nMatched} Parents updated.`);
    const studentsRefresh = await updateStudentsCollection();
    console.log(`${studentsRefresh.nUpserted} Students added. ${studentsRefresh.nMatched} Students updated.`);
    const paymentsRefresh = await updatePaymentsCollection();
    console.log(`${paymentsRefresh.nInserted} Payments added. ${paymentsRefresh.total} total Payments.`)
    const debtsRefresh = await updateDebtsCollection();
    console.log(`${debtsRefresh.total} Debts pending.`)
    const employeesRefresh = await updateEmployeesCollection();
    console.log(`${employeesRefresh.nUpserted} Employees added. ${employeesRefresh.nMatched} Employees updated.`);
    console.log('Done refreshing Collections.');
  } catch (err) {
    console.log('Error refreshing the collections.', err.message);
  }
}

module.exports = {
  refreshCollections,
};
