const jwt = require('jsonwebtoken')
const { getGoogleOAuthProfile, getUserByEmailAndPassword, createUserIfNotExists, userExists, setUserCookieSession } = require('./auth.utils');
require('dotenv').config();

const { JWT_SECRET_USERS } = process.env;

async function signInWithEmailAndPassword(req, res) {
  try {
    const { email, password, session } = req.body;

    // Obtenemos el perfil del usuario de nuestra BD
    const userAccount = (await getUserByEmailAndPassword(email, password))?.toJSON();

    const token = jwt.sign(userAccount, JWT_SECRET_USERS);

    // Creamos una sesion para poder loguear al usuario cuando vuelva
    if (session) setUserCookieSession(req, res, token);

    return res.status(200).json({ token, ...userAccount });
  } catch (error) {
    res.status(400).json({
      error: 'Error al iniciar sesion con Email y Contraseña',
      message: error.message
    })
  }
}

async function signInWithGoogle(req, res) {
  try {
    const { token: googleToken } = req.body;
    // Tira error si el token es erroneo
    const googleUserProfile = await getGoogleOAuthProfile(googleToken);

    const basicProfile = {
      imageUrl: googleUserProfile.picture,
      email: googleUserProfile.email,
      fullname: googleUserProfile.name,
      names: googleUserProfile.given_name,
      lastnames: googleUserProfile.family_name,
    }

    // Solo usuarios pre-creados pueden loguearse
    if (!(await userExists(basicProfile))) {
      return res.status(403).json({
        error: 'Error al iniciar sesion con Google',
        message: 'Cuenta no permitida'
      })
    }
    
    const userAccount = (await createUserIfNotExists(basicProfile)).toJSON();

    const token = jwt.sign(userAccount, JWT_SECRET_USERS);

    // Creamos una sesion para poder loguear al usuario cuando vuelva
    // Loguearse por Google siempre sera guardado como una sesion
    setUserCookieSession(req, res, token);

    return res.status(200).json({ token, ...userAccount });

  } catch (error) {
    return res.status(400).json({
      error: 'Error al inicar sesion con Google',
      message: error.message,
    })
  }
}

async function checkSession(req, res) {
  try {

    const { user: token } = req.signedCookies;

    if (!token) return res.status(200).send(null); // Enviamos null ya que nuestro context del cliente registrara este valor como usuario

    const userProfile = jwt.verify(token, JWT_SECRET_USERS);

    // Solo usuarios pre-creados pueden loguearse
    if (!(await userExists(userProfile))) {
      return res.status(401).json({
        error: 'Sesion invalida',
        message: 'Usuario invalido'
      });
    }

    return res.status(200).json({ token, ...userProfile });
  } catch (error) {
    return res.status(400).json({
      error: 'Sesion invalida',
      message: error.message
    })
  }
}

async function logout(req, res) {
  return res.clearCookie('user').redirect('/');
}

module.exports = {
  signInWithEmailAndPassword,
  signInWithGoogle,
  checkSession,
  logout
}