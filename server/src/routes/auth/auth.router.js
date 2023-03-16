const express = require('express');
const { signInWithGoogle, logout } = require('./auth.controller');
const authRouter = express.Router();

authRouter.post('/google', signInWithGoogle);
authRouter.post('/logout', logout);

module.exports = authRouter;
