const express = require('express');
const {
  httpGetAllParents,
  httpCreateParent,
  httpUpdateParent,
  httpDeleteParent,
  httpGetParent,
} = require('./parents.controller');

const parentsRouter = express.Router();

parentsRouter.get('/', httpGetAllParents);
parentsRouter.get('/:id', httpGetParent);
parentsRouter.post('/', httpCreateParent);
parentsRouter.put('/:id', httpUpdateParent);
parentsRouter.delete('/:id', httpDeleteParent);

module.exports = parentsRouter;
