const jwt = require('jsonwebtoken');
const Users = require('../../models/users/users.model');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const { JWT_SECRET_USERS } = process.env;

async function checkUserAuth(req, res, next) {
  try {
    // Obtenemos el token para verificar el usuario
    const bearer = req.headers?.authorization;
    const token = bearer?.split(' ')[1];

    const userProfile = jwt.verify(token, JWT_SECRET_USERS);

    const isAnUser = await Users.userExists(userProfile);
    if (!isAnUser) throw new Error('Invalid user data');

    // Pasamos una variable de un middelware a otro
    res.locals.userProfile = userProfile;

    return next(); // Si no hay error, el usuario esta autorizado
  } catch (error) {
    return res.status(401).json({
      error: 'User unauthenticated',
      message: error.message,
    })
  }
}

const checkUserPrivilegesAccess = (privilege = "users", access = "read") => async (req, res, next) => {
  try {
    // Obtenemos el perfil del usuario del checkUserAuth middleware
    const { userProfile } = res.locals;
    
    // Leemos los privilegios del usuario 
    const isAllowed = (await Users.getUserByEmail(userProfile.email)).privileges[privilege][access];
    if (!isAllowed) throw new Error('Insufficient privileges')

    return next(); // Si no hay error, el usuario esta autorizado
  } catch (error) {
    return res.status(403).json({
      error: 'User unauthorized',
      message: error.message,
    })
  }
}

async function getUserByEmailAndPassword(email, password) {
  const userAccount = await Users.getUserByEmail(email);

  const passwordMatched = await userAccount?.comparePassword(password);

  if (!passwordMatched) throw new Error('Incorrect Email or Password');

  return userAccount;
}

async function createUserIfNotExists(userData) {
  const userAccount = await Users.getUserByEmail(userData.email);

  if (!userAccount) return await Users.createUser(userData);

  return userAccount;
}

// Verificamos que el usuario este permitido por el administrador
async function isAnAllowedUser(userData) {
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

module.exports = {
  checkUserAuth,
  checkUserPrivilegesAccess,
  getGoogleOAuthProfile,
  isAnAllowedUser,
  createUserIfNotExists,
  getUserByEmailAndPassword,
}