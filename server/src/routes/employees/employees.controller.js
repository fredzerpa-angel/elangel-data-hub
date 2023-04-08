const {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployeeBySearch,
  upsertEmployeesByBundle,
} = require('../../models/employees/employees.model');

async function httpGetAllEmployees(req, res) {
  const { search } = req.query;
  
  try {
    // Si hubo una consulta entonces buscar por consulta
    const response = search ? await getEmployeeBySearch(search) : await getAllEmployees();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(502).json({ // Base de Datos tiro un error
      error: 'Failed to fetch employees',
      message: error.message,
    });
  }
}

async function httpGetEmployee(req, res) {
  const { id } = req.params;

  try {
    return res.status(200).json(await getEmployeeById(id));
  } catch (error) {
    return res.status(502).json({ // Base de Datos tiro un error
      error: 'Failed to fetch employees',
      message: error.message,
    });
  }
}

async function httpCreateEmployee(req, res) {
  const employeeData = req.body;

  try {
    return res.status(201).json(await createEmployee(employeeData));
  } catch (error) {
    return res.status(502).json({ // Base de Datos tiro un error
      error: 'Failed to create new employee',
      message: error.message,
    });
  }
}

async function httpUpdateEmployee(req, res) {
  const employeeId = req.params.id;
  const updateData = req.body;

  // TODO: Implementar validaciones

  try {
    return res.status(200).json(await updateEmployee(employeeId, updateData));
  } catch (error) {
    return res.status(502).json({ // Base de datos tiro un error
      error: 'Failed to update employee',
      message: error.message,
    });
  }
}

async function httpDeleteEmployee(req, res) {
  const employeeId = req.params.id;

  // TODO: Implementar validaciones

  try {
    return res.status(200).json(await deleteEmployee(employeeId));
  } catch (error) {
    return res.status(502).json({ // Base de datos tiro un error
      error: 'Failed to delete employee',
      message: error.message,
    });
  }
}

async function httpCreateEmployeesByBundle(req, res) {
  const bundle = req.body;

  if (!Array.isArray(bundle))
    return res.status(400).json({
      code: 400,
      error: 'Data is not bundled',
      message: 'The passed data is not an Array of data',
    });

  // TODO: Implementar validaciones

  try {
    return res.status(201).json(await upsertEmployeesByBundle(bundle));
  } catch (error) {
    return res.status(502).json({ // Base de datos tiro un error
      error: 'Failed to create bundle of employee',
      message: error.message,
    });
  }
}

module.exports = {
  httpGetAllEmployees,
  httpGetEmployee,
  httpCreateEmployee,
  httpCreateEmployeesByBundle,
  httpUpdateEmployee,
  httpDeleteEmployee,
};
