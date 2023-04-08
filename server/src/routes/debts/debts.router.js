const express = require('express');
const {
  httpGetAllDebts,
  httpCreateDebt,
  httpUpdateDebt,
  httpDeleteDebt,
  httpGetDebt,
} = require('./debts.controller');

const debtsRouter = express.Router();

debtsRouter.get('/', httpGetAllDebts);
debtsRouter.get('/:id', httpGetDebt);
debtsRouter.post('/', httpCreateDebt);
debtsRouter.put('/:id', httpUpdateDebt);
debtsRouter.delete('/:id', httpDeleteDebt);

module.exports = debtsRouter;
