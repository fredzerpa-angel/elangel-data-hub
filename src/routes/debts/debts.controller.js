const {
  getAllDebts,
  createDebt,
  updateDebt,
  deleteDebt,
  getDebtById,
  getDebtBySearch,
} = require('../../models/debts/debts.model');

async function httpGetAllDebts(req, res) {
  const { student, parent } = req.query;

  // Selecciona que tipo de busqueda se desea hacer: Estudiantes o Padres
  // Si no existe un tipo de busqueda retorna undefined
  const queryType = Object.keys(req.query)[0];

  // TODO: Implementar las validaciones
  let response;

  try {
    // Si hubo una consulta entonces buscar por consulta
    if (queryType) {
      const searchParams = {
        searchBy: queryType,
        value: student ?? parent,
      };

      response = await getDebtBySearch(searchParams);
    } else {
      // Si no hubo consulta entonces retorna todos los estudiantes
      response = await getAllDebts();
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(502).json({
      code: 502, // Base de Datos tiro un error
      error: 'Failed to fetch debts',
      message: error.message,
    });
  }
}

async function httpGetDebt(req, res) {
  const { id } = req.params;
  // TODO: Implementar las validaciones
  try {
    return res.status(200).json(await getDebtById(id));
  } catch (error) {
    return res.status(502).json({
      code: 502, // Base de Datos tiro un error
      error: 'Failed to fetch debts',
      message: error.message,
    });
  }
}

async function httpCreateDebt(req, res) {
  const debtData = req.body;

  // TODO: Implementar las validaciones

  try {
    return res.status(201).json(await createDebt(debtData));
  } catch (error) {
    return res.status(502).json({
      code: 502, // Base de Datos tiro un error
      error: 'Failed to create new debt',
      message: error.message,
    });
  }
}

async function httpUpdateDebt(req, res) {
  const debtId = req.params.id;
  const updateData = req.body;

  // TODO: Implementar validaciones

  try {
    return res.status(200).json(await updateDebt(debtId, updateData));
  } catch (error) {
    return res.status(502).json({
      code: 502, // Base de datos tiro un error
      error: 'Failed to update debt',
      message: error.message,
    });
  }
}

async function httpDeleteDebt(req, res) {
  const debtId = req.params.id;

  // TODO: Implementar validaciones

  try {
    return res.status(200).json(await deleteDebt(debtId));
  } catch (error) {
    return res.status(502).json({
      code: 502, // Base de datos tiro un error
      error: 'Failed to delete debt',
      message: error.message,
    });
  }
}

module.exports = {
  httpGetAllDebts,
  httpGetDebt,
  httpCreateDebt,
  httpUpdateDebt,
  httpDeleteDebt,
};
