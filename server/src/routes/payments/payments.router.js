const express = require('express');
const {
  httpGetAllPayments,
  httpCreatePayment,
  httpUpdatePayment,
  httpDeletePayment,
  httpGetPayment,
} = require('./payments.controller');

const paymentsRouter = express.Router();

paymentsRouter.get('/', httpGetAllPayments);
paymentsRouter.get('/:id', httpGetPayment);
paymentsRouter.post('/', httpCreatePayment);
paymentsRouter.put('/:id', httpUpdatePayment);
paymentsRouter.delete('/:id', httpDeletePayment);

module.exports = paymentsRouter;
