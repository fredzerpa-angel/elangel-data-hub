const ArcadatApi = require('../api/Arcadat/Arcadat.api');
const { getAllDebts, createDebt } = require('../models/debts/debts.model');
const { upsertParentsByBundle, getParentByDocumentId } = require('../models/parents/parents.model');
const { getAllPayments, createPayment } = require('../models/payments/payments.model');
const { upsertStudentsByBundle, updateStudentByDocumentId, addDebtToStudentByDocumentId, deleteDebtFromStudentByDocumentId } = require('../models/students/students.model');

async function updateParentsCollection() {
  // TODO: Agregar Padres Administrativos
  const currentAcademicParents = await ArcadatApi.getAcademicParents();
  currentAcademicParents.forEach(parent => {
    parent.isParentAdmin = false;
    parent.isParentAcademic = true;
  });
  return await upsertParentsByBundle(currentAcademicParents);
}

async function updateStudentsCollection() {
  const currentStudents = await ArcadatApi.getStudents();

  // Enlazamos los estudiantes y padres (Obtener el ObjectId de los padres para los estudiantes)
  const studentsWithParentsLinks = currentStudents.map(async student => {
    const parentsEntries = Object.entries(student.parents);
    const parentsWithLinksEntries = parentsEntries.map(
      async ([parentType, parentData]) => {
        const parent = await getParentByDocumentId(Number(parentData.documentId.number));
        return [parentType, parent?._id];
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
  const formerPayments = await getAllPayments();

  const totalPaymentsDifference = currentPayments.length - formerPayments.length;
  if (totalPaymentsDifference > 0) {
    for (let count = totalPaymentsDifference; count > 0; count--) {
      const payment = currentPayments.at(count * -1);
      const { student, cashier } = payment;
      delete payment.cashier;
      delete payment.student;
      // TODO: Mejorar el rendimiento para la creacion de pagos e inclusion en los estudiantes 
      const paymentCreated = await createPayment(payment);
      const updatedStudent = await updateStudentByDocumentId(Number(student.documentId.number), { payments: [paymentCreated._id] })
    }
  }

  return { nInserted: totalPaymentsDifference }
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
    const key = debt.schoolTerm + debt.student.fullname + debt.concept + debt.status.issuedAt;

    records.old.set(key, debt);
  })

  currentDebts.forEach(async debt => {
    // Creamos una llave unica para identificar cada deuda
    const key = debt.schoolTerm + debt.student.fullname + debt.concept + debt.status.issuedAt;
    // Agregamos la deuda a nuestros registros
    records.new.set(key, debt);

    // Si no esta guardada en el record, es porque la deuda es nueva
    if (!records.old.has(key)) {

      // Creamos la deuda
      const createdDebt = await createDebt(debt);

      console.log(debt);

      // Agregamos la deuda al estudiante
      const studentDocumentId = debt.student.documentId.number;
      const addDebtToStudentResponse = await addDebtToStudentByDocumentId(studentDocumentId, createdDebt);
    }

  })

  // Comparamos los registros para encontrar las deudas ya pagadas
  records.old.forEach(async (oldDebt, oldDebtKey) => {
    const studentDocumentId = oldDebt.documentId.number;
    // Eliminamos cualquier deuda que ya no este registrada en ARCADAT
    if (!records.new.has(oldDebtKey)) await deleteDebtFromStudentByDocumentId(studentDocumentId, oldDebt);
  })

}

async function refreshCollections() {
  console.log('Start refreshing Collections..');
  // const parentsRefresh = await updateParentsCollection();
  // console.log(`${parentsRefresh.nUpserted + parentsRefresh.nMatched} Parents refreshed`);
  // const studentsRefresh = await updateStudentsCollection();
  // console.log(`${studentsRefresh.nUpserted + studentsRefresh.nMatched} Students refreshed.`);
  // const paymentsRefresh = await updatePaymentsCollection();
  // console.log(`${paymentsRefresh.nInserted} Payments added.`)
  const debtsRefresh = await updateDebtsCollection();
  console.log('Done refreshing Collections.');
}

module.exports = {
  refreshCollections,
};
