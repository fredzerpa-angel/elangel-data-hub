const express = require('express');
const { checkUserPrivilegesAccess } = require('../auth/auth.utils');
const {
  httpGetAllUsers,
  httpGetUser,
  httpCreateUser,
  httpUpdateUserByEmail,
  httpDeleteUserByEmail,
  httpChangePassword,
} = require('./users.controller');

const usersRouter = express.Router();

usersRouter.get('/', checkUserPrivilegesAccess('users', 'read'), httpGetAllUsers);
usersRouter.get('/:id', checkUserPrivilegesAccess('users', 'read'), httpGetUser);

usersRouter.post('/change-password', httpChangePassword);
usersRouter.post('/', checkUserPrivilegesAccess('users', 'upsert'), httpCreateUser);
// usersRouter.post('/set-password/:id', checkUserPrivilegesAccess('users', 'upsert'), );

usersRouter.put('/:email', checkUserPrivilegesAccess('users', 'upsert'), httpUpdateUserByEmail);

usersRouter.delete('/:email', checkUserPrivilegesAccess('users', 'delete'), httpDeleteUserByEmail);

module.exports = usersRouter;
