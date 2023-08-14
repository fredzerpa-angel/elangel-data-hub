const express = require('express');
const {
  httpGetAllParents,
  httpCreateParent,
  httpUpdateParent,
  httpDeleteParent,
  httpGetParent,
} = require('./parents.controller');

const parentsRouter = express.Router();

// * Tomar en cuenta el orden de las rutas, ya que la respuesta dependera de cual coincida primero
parentsRouter.get('/:id', httpGetParent);
parentsRouter.get('/', httpGetAllParents);

parentsRouter.post('/', httpCreateParent);

parentsRouter.put('/:id', httpUpdateParent);

parentsRouter.delete('/:id', httpDeleteParent);

module.exports = parentsRouter;
