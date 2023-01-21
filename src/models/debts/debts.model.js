const debts = require('./debts.mongo');
const { getStudentBySearch } = require('../students/students.model');
const { getParentBySearch } = require('../parents/parents.model');

async function getAllDebts() {
  return await debts.find().lean();
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
        __v: 0,
        payments: 0,
        debts: 0,
      },
    },
    {
      path: 'father',
      select: {
        __v: 0,
      },
    },
    {
      path: 'mother',
      select: {
        __v: 0,
      },
    },
    {
      path: 'parentAdmin',
      select: {
        __v: 0,
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

async function upsertDebtsByBundle(bundle) {
  return await debts.upsertMany(bundle, {
    matchFields: ['schoolTerm', 'student.fullname', 'concept'], // Compara los docs mediante este campo
    ensureModel: true, // Valida la data por el Schema
  });
}

module.exports = {
  getAllDebts,
  createDebt,
  updateDebt,
  deleteDebt,
  getDebtById,
  getDebtBySearch,
  upsertDebtsByBundle,
};
