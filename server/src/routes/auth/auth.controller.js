const { OAuth2Client } = require('google-auth-library');
const { DateTime } = require('luxon');
require('dotenv').config();

const { GOOGLE_CLIENT_ID } = process.env;

// Nos permite verificar que el JWT Token de Google es autentico y nos retorna los datos del usuario
async function getGoogleOAuthProfile(jwtToken) {
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);

  // Verificamos y decodificamos el JTW Token de Google (credential)
  const ticket = await client.verifyIdToken({
    idToken: jwtToken,
    audience: GOOGLE_CLIENT_ID,
  });

  // Obtenemos un JSON con la data del usuario
  const payload = ticket.getPayload();

  return payload;
}

async function signInWithGoogle(req, res) {
  const { token } = req.body;

  try {
    // Tira error si el token es erroneo
    const userProfile = await getGoogleOAuthProfile(token);

    const profileEssentialData = {
      token,
      picture: userProfile.picture,
      email: userProfile.email,
      fullname: userProfile.name,
      firstName: userProfile.given_name,
      lastName: userProfile.family_name,
    }
    
    // Creamos una cookie con los datos del usuario
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

    return res.status(200).json(profileEssentialData);

  } catch (error) {
    return res.status(400).json({
      error: 'Failed to authenticate with Google',
      message: error.message,
    })
  }
}

async function logout(req, res) {
  return res.clearCookie('user').redirect('/');
}

module.exports = {
  signInWithGoogle,
  logout
}