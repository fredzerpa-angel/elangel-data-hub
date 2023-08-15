const express = require('express');
const {
  httpGetAllPayments,
  httpCreatePayment,
  httpUpdatePayment,
  httpDeletePayment,
  httpGetPayment,
} = require('./payments.controller');
const { checkUserPrivilegesAccess } = require('../auth/auth.utils');

const paymentsRouter = express.Router();

paymentsRouter.get('/:id', checkUserPrivilegesAccess('reports', 'read'), httpGetPayment);
paymentsRouter.get('/', checkUserPrivilegesAccess('reports', 'read'), httpGetAllPayments);

// * Los pagos son manejadas por ARCADAT por lo que su manejo por el DataHub esta actualmente deshabilitado
// paymentsRouter.post('/', checkUserPrivilegesAccess('reports', 'upsert'), httpCreatePayment);

// paymentsRouter.put('/:id', checkUserPrivilegesAccess('reports', 'upsert'), httpUpdatePayment);

// paymentsRouter.delete('/:id', checkUserPrivilegesAccess('reports', 'delete'), httpDeletePayment);

module.exports = paymentsRouter;
