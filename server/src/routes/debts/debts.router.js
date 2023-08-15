const express = require('express');
const {
  httpGetAllDebts,
  httpCreateDebt,
  httpUpdateDebt,
  httpDeleteDebt,
  httpGetDebt,
  httpGetDebtsNotifications,
} = require('./debts.controller');
const { checkUserPrivilegesAccess } = require('../auth/auth.utils');
const { checkNotificationStatus } = require('../../utils/routes.utils');

const debtsRouter = express.Router();

// * Tomar en cuenta el orden de las rutas, ya que la respuesta dependera de cual coincida primero
debtsRouter.get('/notifications', checkNotificationStatus('debts', 'onWatch'), httpGetDebtsNotifications);
debtsRouter.get('/:id', checkUserPrivilegesAccess('reports', 'read'), httpGetDebt);
debtsRouter.get('/', checkUserPrivilegesAccess('reports', 'read'), httpGetAllDebts);

// * Las deudas son manejadas por ARCADAT por lo que su manejo por el DataHub esta actualmente deshabilitado
// debtsRouter.post('/', checkUserPrivilegesAccess('reports', 'upsert'), httpCreateDebt);

// debtsRouter.put('/:id', checkUserPrivilegesAccess('reports', 'upsert'), httpUpdateDebt);

// debtsRouter.delete('/:id', checkUserPrivilegesAccess('reports', 'delete'), httpDeleteDebt);

module.exports = debtsRouter;
