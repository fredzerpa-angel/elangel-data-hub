const payments = require('./payments.mongo');
const { getStudentBySearch } = require('../students/students.model');

async function getAllPayments() {
  return await payments.find({});
}

async function createPayment(paymentData) {
  return await payments.create(paymentData);
}

async function updatePayment(paymentId, updateData) {
  const options = {
    new: true, // Retorna el Estudiante con los datos actualizados
    runValidators: true, // Aplica las validaciones del Payment Schema otra vez
  };

  return await payments.findByIdAndUpdate(paymentId, updateData, options);
}

async function deletePayment(paymentId) {
  return await payments.findByIdAndDelete(paymentId);
}

async function getPaymentById(paymentId) {
  return await payments.findById(paymentId);
}

async function getPaymentBySearch({ searchBy, value }) {
  // Payer no posee un Schema propio por lo que su busqueda
  // es distinta
  if (searchBy === 'payer')
    return await payments
      .find()
      .or([
        { 'payer.fullname': new RegExp(value, 'gi') },
        { 'payer.refId': new RegExp(value, 'gi') },
      ]);

  // Obtenemos respuesta del Modelo por filtrado
  // Nota: la respuesta es un array de todos los resultados posibles
  const response =
    searchBy === 'student'
      ? await getStudentBySearch(value)
      : await getCashierBySearch(value);

  const ids = response.map(res => res._id);

  // Retornamos las deudas que esten relacionadas a la respuesta
  const populateConfig = [
    {
      path: 'student',
      select: {
        __v: 0,
        payments: 0,
      },
    },
    {
      path: 'cashier',
      select: {
        __v: 0,
      },
    },
  ];

  // Busca todas las deudas relacionadas a un Estudiante o Cajero
  // Donde su Id este en el Array de Ids
  return await payments
    .find({
      [searchBy]: { $in: ids },
    })
    .populate(populateConfig);
}

async function createPaymentsByBundle(bundle) {
  return await payments.insertMany(bundle, { lean: true });
}

module.exports = {
  getAllPayments,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentById,
  getPaymentBySearch,
  createPaymentsByBundle
};
