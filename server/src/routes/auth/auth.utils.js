const jwt = require('jsonwebtoken');
const Users = require('../../models/users/users.model');
const { OAuth2Client } = require('google-auth-library');
const { DateTime } = require('luxon');
const { formDataToObj } = require('../../utils/functions.utils');
require('dotenv').config();

const { JWT_SECRET_USERS } = process.env;

async function checkUserAuth(req, res, next) {
  try {
    // Obtenemos el token para verificar el usuario
    const bearer = req.headers?.authorization;
    const token = bearer?.split(' ')[1];

    const userProfile = jwt.verify(token, JWT_SECRET_USERS);

    const userAccount = await Users.getUserByEmail(userProfile.email);
    if (!userAccount) throw new Error('Datos de usuario invalidos');

    // Pasamos una variable de un middelware a otro
    res.locals.userProfile = userAccount.toObject({ versionKey: false });

    return next(); // Si no hay error, el usuario esta autorizado
  } catch (error) {
    return res.status(401).json({
      error: 'Usuario no autorizado',
      message: error.message,
    })
  }
}

const checkUserPrivilegesAccess = (privilege = 'users', access = 'read') => async (req, res, next) => {
  try {
    // Obtenemos el perfil del usuario del checkUserAuth middleware
    const { userProfile } = res.locals;

    // Leemos los privilegios del usuario 
    const accessAllowed = userProfile.privileges[privilege][access];
    if (!accessAllowed) throw new Error('Privilegios insuficientes')


    // Verificamos privilegios en las actualizaciones de cuentas
    const accessingAdminPrivilege = privilege === 'users' && access !== 'read';
    if (accessingAdminPrivilege) {
      const { email } = req.params; // La ruta /api/users cualquier actualizacion se hara directamente por el email (/api/users/:email)
      const updateData = formDataToObj(req.body);
      const userToUpdate = await Users.getUserByEmail(email);

      // Supervisores, y dar permisos de Administrador, solo son editables por Administradores
      const updatingSupervisor = userToUpdate?.privileges?.users?.upsert || userToUpdate?.privileges?.users?.delete;
      const givingAdminPrivileges = updateData?.isAdmin;
      const givingSupervisorPrivileges = updateData?.privileges?.users?.upsert || updateData?.privileges?.users?.delete;


      const adminActionsList = [givingSupervisorPrivileges, updatingSupervisor, givingAdminPrivileges]

      // Validamos acciones de tipo admin
      if (userToUpdate?.isAdmin || (!userProfile.isAdmin && adminActionsList.some(Boolean))) throw new Error('Privilegios insuficientes')
    }

    return next(); // Si no hay error, el usuario esta autorizado
  } catch (error) {
    return res.status(403).json({
      error: 'Usuario no autorizado',
      message: error.message,
    })
  }
}

async function getUserByEmailAndPassword(email, password) {
  const userAccount = await Users.getUserByEmail(email);

  const passwordMatched = await userAccount?.comparePassword(password);

  if (!passwordMatched) throw new Error('Correo y/o contraseña incorrecta');

  return userAccount;
}

async function createUserIfNotExists(userData) {
  const userAccount = await Users.getUserByEmail(userData.email);

  if (!userAccount) return await Users.createUser(userData);

  return userAccount;
}

// Verificamos que el usuario este permitido por el administrador
async function userExists(userData) {
  // Si el usuario esta agregado a la BD entonces fue permitido por el Administrador
  return await Users.userExists(userData);
}

// Nos permite verificar que el JWT Token de Google es autentico y nos retorna los datos del usuario
async function getGoogleOAuthProfile(token) {
  const { GOOGLE_CLIENT_ID } = process.env;
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);

  // Verificamos y decodificamos el JTW Token de Google (credential)
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });

  // Obtenemos un JSON con la data del usuario
  const payload = ticket.getPayload();

  return payload;
}

function setUserCookieSession(req, res, data) {
  try {

    return res.cookie(
      'user',
      data, // Guardamos el token en una sesion para leer los datos del usuario cuando vuelva a ingresar 
      {
        maxAge: DateTime.now().plus({ weeks: 2 }).diffNow('milliseconds'), // La sesion expira en 2 semanas
        sameSite: true,
        httpOnly: true,
        signed: true,
      }
    );
  } catch (err) {
    throw new Error('No se pudo crear el Cookie de Sesion de Usuario')
  }

}

module.exports = {
  checkUserAuth,
  checkUserPrivilegesAccess,
  getGoogleOAuthProfile,
  userExists,
  createUserIfNotExists,
  getUserByEmailAndPassword,
  setUserCookieSession
}