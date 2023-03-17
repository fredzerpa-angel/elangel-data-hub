const express = require('express');
const { signInWithGoogle, logout, signInWithEmailAndPassword, checkSession } = require('./auth.controller');
const authRouter = express.Router();

authRouter.post('/login', signInWithEmailAndPassword);
authRouter.post('/google', signInWithGoogle);
authRouter.post('/session', checkSession);
authRouter.post('/logout', logout);

module.exports = authRouter;