const payments = require('./payments.mongo');

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
  return await payments.find({ [searchBy]: new RegExp(value, 'gi') });
}

module.exports = {
  getAllPayments,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentById,
  getPaymentBySearch,
};
