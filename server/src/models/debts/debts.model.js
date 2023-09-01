const debts = require('./debts.mongo');
const { getStudentBySearch } = require('../students/students.model');
const { getParentBySearch } = require('../parents/parents.model');
const { DateTime } = require('luxon');

async function getAllDebts() {
  return await debts.find().lean();
}

async function getAllDebtsPopulated() {
  return await debts.find().populate({
    path: 'student',
    select: {
      directDebit: 0,
      grades: 0,
    },
  }).lean();
}

async function createDebt(debtData) {
  return await debts.create(debtData);
}

async function updateDebt(debtId, updateData) {
  const options = {
    new: true, // Retorna el Estudiante con los datos actualizados
    runValidators: true, // Aplica las validaciones del Debt Schema otra vez
  };

  return await debts.findByIdAndUpdate(debtId, updateData, options);
}

async function deleteDebt(debtId) {
  return await debts.findByIdAndDelete(debtId);
}

async function getDebtById(debtId) {
  return await debts.findById(debtId);
}

async function getDebtBySearch({ searchBy, value }) {
  // Obtenemos respuesta del Modelo por filtrado
  // Nota: la respuesta es un array de todos los resultados posibles
  const response =
    searchBy === 'student'
      ? await getStudentBySearch(value)
      : await getParentBySearch(value);

  const ids = response.map(res => res._id);

  // Retornamos las deudas que esten relacionadas a la respuesta
  const populateConfig = [
    {
      path: 'student',
      select: {
        directDebit: 0,
        grades: 0,
      },
    },
  ];

  // Busca todas las deudas relacionadas a un Estudiante o Padre
  // Donde su Id este en el Array de Ids
  return await debts
    .find({
      [searchBy]: { $in: ids },
    })
    .populate(populateConfig)
    .lean();
}

// @bundle: Array[Object{debt}]
// Recibe un array de objetos donde crea un key con los matchfields para encontrarlo en la coleccion
async function upsertDebtsByBundle(bundle) {
  return await debts.upsertMany(bundle, {
    matchFields: ['schoolTerm', 'concept', 'student'], // Compara los docs mediante este campo
    ensureModel: true, // Valida la data por el Schema
  });
}

// @childrenIds : Array[ObjectId]
// Recibe los Ids de los estudiantes de la familia, para calcular la deuda familiar 
async function getFamilyDebt(childrenIds) {
  const familyDebts = await debts.find({ student: { $in: childrenIds } })

  const totalFamilyDebt = familyDebts.reduce((totalDebt, debt) => totalDebt + debt.amount.usd, 0);

  return totalFamilyDebt;
}

async function getDebtsByConcept(concept) {
  return await debts.find({ concept })
}

async function getDebtsBySchoolTerm(schoolTerm = `${DateTime.now().minus({ years: 1 }).year}-${DateTime.now().year}`) {
  return await debts.find({ schoolTerm })
}

async function getDebtsByYearIssued(year = DateTime.now().year) {
  return await debts.find({ 'status.issuedAt': new RegExp(`${year}$`) }) // $ es un anchor de RegExp que busca al final del String
}

module.exports = {
  getAllDebts,
  getAllDebtsPopulated,
  createDebt,
  updateDebt,
  deleteDebt,
  getDebtById,
  getDebtBySearch,
  upsertDebtsByBundle,
  getFamilyDebt,
  getDebtsByConcept,
  getDebtsBySchoolTerm,
  getDebtsByYearIssued,
};
