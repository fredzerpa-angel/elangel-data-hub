const {
  getAllPayments,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentById,
  getPaymentBySearch,
} = require('../../models/payments/payments.model');

async function httpGetAllPayments(req, res) {
  const { student, name, ref } = req.query;
  const QUERY_MAP = {
    student: 'studentFullname',
    name: 'payerName',
    ref: 'payerRefId'
  }
  const queryType = Object.keys(req.query)[0];

  // TODO: Implementar las validaciones
  let response;

  try {
    // Si hubo una consulta entonces buscar por consulta
    if (queryType) {
      const search = {
        searchBy: QUERY_MAP[queryType],
        value: student ?? name ?? ref,
      };
      
      response = await getPaymentBySearch(search);
    } else {
      // Si no hubo consulta entonces retorna todos los estudiantes
      response = await getAllPayments();
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(502).json({
      code: 502, // Base de Datos tiro un error
      error: 'Failed to fetch payments',
      message: error.message,
    });
  }
}

async function httpGetPayment(req, res) {
  const { id } = req.params;
  // TODO: Implementar las validaciones
  try {
    return res.status(200).json(await getPaymentById(id));
  } catch (error) {
    return res.status(502).json({
      code: 502, // Base de Datos tiro un error
      error: 'Failed to fetch payments',
      message: error.message,
    });
  }
}

async function httpCreatePayment(req, res) {
  const paymentData = req.body;

  // TODO: Implementar las validaciones

  try {
    return res.status(201).json(await createPayment(paymentData));
  } catch (error) {
    return res.status(502).json({
      code: 502, // Base de Datos tiro un error
      error: 'Failed to create new payment',
      message: error.message,
    });
  }
}

async function httpUpdatePayment(req, res) {
  const paymentId = req.params.id;
  const updateData = req.body;

  // TODO: Implementar validaciones

  try {
    return res.status(200).json(await updatePayment(paymentId, updateData));
  } catch (error) {
    return res.status(502).json({
      code: 502, // Base de datos tiro un error
      error: 'Failed to update payment',
      message: error.message,
    });
  }
}

async function httpDeletePayment(req, res) {
  const paymentId = req.params.id;

  // TODO: Implementar validaciones

  try {
    return res.status(200).json(await deletePayment(paymentId));
  } catch (error) {
    return res.status(502).json({
      code: 502, // Base de datos tiro un error
      error: 'Failed to delete payment',
      message: error.message,
    });
  }
}

module.exports = {
  httpGetAllPayments,
  httpGetPayment,
  httpCreatePayment,
  httpUpdatePayment,
  httpDeletePayment,
};
