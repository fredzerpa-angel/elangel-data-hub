const {
  getAllParents,
  createParent,
  updateParent,
  deleteParent,
  getParentById,
  getParentBySearch,
} = require('../../models/parents/parents.model');

async function httpGetAllParents(req, res) {
  const { search } = req.query;

  // TODO: Implementar las validaciones
  try {
    // Si hubo una consulta entonces buscar por consulta
    const response = search ? await getParentBySearch(search) : await getAllParents();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(502).json({ // Base de Datos tiro un error
      error: 'Failed to fetch parents',
      message: error.message,
    });
  }
}

async function httpGetParent(req, res) {
  const { id } = req.params;
  // TODO: Implementar las validaciones
  try {
    return res.status(200).json(await getParentById(id));
  } catch (error) {
    return res.status(502).json({ // Base de Datos tiro un error
      error: 'Failed to fetch parents',
      message: error.message,
    });
  }
}

async function httpCreateParent(req, res) {
  const parentData = req.body;

  // TODO: Implementar las validaciones

  try {
    return res.status(201).json(await createParent(parentData));
  } catch (error) {
    return res.status(502).json({ // Base de Datos tiro un error
      error: 'Failed to create new parent',
      message: error.message,
    });
  }
}

async function httpUpdateParent(req, res) {
  const parentId = req.params.id;
  const updateData = req.body;

  // TODO: Implementar validaciones

  try {
    return res.status(200).json(await updateParent(parentId, updateData));
  } catch (error) {
    return res.status(502).json({ // Base de datos tiro un error
      error: 'Failed to update parent',
      message: error.message,
    });
  }
}

async function httpDeleteParent(req, res) {
  const parentId = req.params.id;

  // TODO: Implementar validaciones

  try {
    return res.status(200).json(await deleteParent(parentId));
  } catch (error) {
    return res.status(502).json({ // Base de datos tiro un error
      error: 'Failed to delete parent',
      message: error.message,
    });
  }
}

module.exports = {
  httpGetAllParents,
  httpGetParent,
  httpCreateParent,
  httpUpdateParent,
  httpDeleteParent,
};
