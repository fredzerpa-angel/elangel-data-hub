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
debtsRouter.get('/:id', checkUserPrivilegesAccess('debts', 'read'), httpGetDebt);
debtsRouter.get('/', checkUserPrivilegesAccess('debts', 'read'), httpGetAllDebts);

debtsRouter.post('/', checkUserPrivilegesAccess('debts', 'upsert'), httpCreateDebt);

debtsRouter.put('/:id', checkUserPrivilegesAccess('debts', 'upsert'), httpUpdateDebt);

debtsRouter.delete('/:id', checkUserPrivilegesAccess('debts', 'delete'), httpDeleteDebt);

module.exports = debtsRouter;
