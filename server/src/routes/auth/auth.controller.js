const jwt = require('jsonwebtoken')
const { DateTime } = require('luxon');
const Users = require('../../models/users/users.model');
const { getGoogleOAuthProfile, getUserByEmailAndPassword, createUserIfNotExists, isAnAllowedUser } = require('./auth.utils');
require('dotenv').config();

const { JWT_SECRET_USERS } = process.env;

async function signInWithEmailAndPassword(req, res) {
  try {
    const { email, password, session } = req.body;

    // Obtenemos el perfil del usuario de nuestra BD
    const userAccount = (await getUserByEmailAndPassword(email, password))?.toObject({ versionKey: false }); //  Excluye la propiedad __v
    delete userAccount._id; // Eliminamos la contraseña para no pasarla al Token
    delete userAccount.password; // Eliminamos la contraseña para no pasarla al Token

    const token = jwt.sign(userAccount, JWT_SECRET_USERS);

    // Creamos una sesion para poder loguear al usuario cuando vuelva
    if (session) {
      res.cookie(
        'user',
        token, // Guardamos el token en una sesion para leer los datos del usuario cuando vuelva a ingresar 
        {
          maxAge: DateTime.now().plus({ weeks: 2 }).diffNow('milliseconds'), // La sesion expira en 2 semanas
          sameSite: true,
          httpOnly: true,
          signed: true,
        }
      );
    }

    return res.status(200).json({ token, ...userAccount });
  } catch (error) {
    res.status(400).json({
      error: 'Failed to log in with Email',
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

    // Verificamos que el usuario que se esta intentando loguear este permitido por el administrador
    if (!(await isAnAllowedUser(basicProfile))) throw new Error('User not allowed')

    const userAccount = (await createUserIfNotExists(basicProfile))?.toObject({ versionKey: false }); //  Excluye la propiedad __v
    delete userAccount._id; // Eliminamos data sensible que se enviara al cliente
    delete userAccount.password; // Eliminamos data sensible que se enviara al cliente

    const token = jwt.sign(userAccount, JWT_SECRET_USERS);

    // Creamos una sesion para poder loguear al usuario cuando vuelva
    // Loguearse por Google siempre sera guardado como una sesion
    res.cookie(
      'user',
      token, // Guardamos el token en una sesion para leer los datos del usuario cuando vuelva a ingresar 
      {
        maxAge: DateTime.now().plus({ weeks: 2 }).diffNow('milliseconds'), // La sesion expira en 2 semanas
        sameSite: true,
        httpOnly: true,
        signed: true,
      }
    );

    return res.status(200).json({ token, ...userAccount });

  } catch (error) {
    return res.status(400).json({
      error: 'Failed to authenticate with Google',
      message: error.message,
    })
  }
}

async function checkSession(req, res) {
  try {

    const { user: token } = req.signedCookies;

    if (!token) return res.status(200).send(null);

    const userProfile = jwt.verify(token, JWT_SECRET_USERS);

    const isActive = await Users.userExists(userProfile);

    if (!isActive) throw new Error('User is not valid');

    return res.status(200).json({ token, ...userProfile });
  } catch (error) {
    return res.status(400).json({
      error: 'Session Invalid',
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