const ArcadatApi = require('../api/Arcadat/Arcadat.api');
const {
  upsertParentsByBundle,
  getParentByDocumentId,
} = require('../models/parents/parents.model');
const { getAllPayments, createPayment } = require('../models/payments/payments.model');
const { upsertStudentsByBundle, updateStudentByDocumentId } = require('../models/students/students.model');

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
  // TODO
}

async function refreshCollections() {
  console.log('Start refreshing Collections..');
  const parentsRefresh = await updateParentsCollection();
  console.log(`${parentsRefresh.nUpserted + parentsRefresh.nMatched} Parents refreshed`);
  const studentsRefresh = await updateStudentsCollection();
  console.log(`${studentsRefresh.nUpserted + studentsRefresh.nMatched} Students refreshed.`);
  const paymentsRefresh = await updatePaymentsCollection();
  console.log(`${paymentsRefresh.nInserted} Payments added.`)
  console.log('Done refreshing Collections.');
}

module.exports = {
  refreshCollections,
};
