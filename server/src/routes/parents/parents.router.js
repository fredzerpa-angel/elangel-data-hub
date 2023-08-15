const express = require('express');
const {
  httpGetAllParents,
  httpCreateParent,
  httpUpdateParent,
  httpDeleteParent,
  httpGetParent,
} = require('./parents.controller');
const { checkUserPrivilegesAccess } = require('../auth/auth.utils');

const parentsRouter = express.Router();

// * Tomar en cuenta el orden de las rutas, ya que la respuesta dependera de cual coincida primero
parentsRouter.get('/:id', checkUserPrivilegesAccess('reports', 'read'), httpGetParent);
parentsRouter.get('/', checkUserPrivilegesAccess('reports', 'read'), httpGetAllParents);

// * Los padres son manejadas por ARCADAT por lo que su manejo por el DataHub esta actualmente deshabilitado
// parentsRouter.post('/', checkUserPrivilegesAccess('reports', 'upsert'), httpCreateParent);

// parentsRouter.put('/:id', checkUserPrivilegesAccess('reports', 'upsert'), httpUpdateParent);

// parentsRouter.delete('/:id', checkUserPrivilegesAccess('reports', 'delete'), httpDeleteParent);

module.exports = parentsRouter;
