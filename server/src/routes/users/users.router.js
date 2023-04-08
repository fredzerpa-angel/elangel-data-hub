const express = require('express');
const { checkUserPrivilegesAccess } = require('../auth/auth.utils');
const {
  httpGetAllUsers,
  httpGetUser,
  httpCreateUser,
  httpUpdateUserByEmail,
  httpDeleteUserByEmail,
  httpUpdateSelfUser,
  httpConfirmPassword,
  httpChangePassword,
} = require('./users.controller');

const usersRouter = express.Router();

// * Tomar en cuenta el orden de las rutas, ya que la respuesta dependera de cual coincida primero
usersRouter.get('/', checkUserPrivilegesAccess('users', 'read'), httpGetAllUsers);
usersRouter.get('/:id', checkUserPrivilegesAccess('users', 'read'), httpGetUser);

usersRouter.post('/', checkUserPrivilegesAccess('users', 'upsert'), httpCreateUser);
usersRouter.post('/confirm-password', httpConfirmPassword);

usersRouter.put('/', httpUpdateSelfUser);
usersRouter.put('/change-password', httpChangePassword);
usersRouter.put('/:email', checkUserPrivilegesAccess('users', 'upsert'), httpUpdateUserByEmail);

usersRouter.delete('/:email', checkUserPrivilegesAccess('users', 'delete'), httpDeleteUserByEmail);

module.exports = usersRouter;
