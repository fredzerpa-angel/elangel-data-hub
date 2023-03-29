const { uploadFileToBucket, deleteFileFromBucket } = require('../../api/AWS/AWS.api');
const {
  getAllUsers,
  createUser,
  deleteUserByEmail,
  getUserById,
  getUserBySearch,
  updateUserById,
  getUserByEmail,
  updateUserByEmail,
} = require('../../models/users/users.model');
const { randomUUID } = require('crypto');
const formData = require('form-data-to-object')

async function httpGetAllUsers(req, res) {
  const { search } = req.query;

  try {
    const response = search ? await getUserBySearch(search) : await getAllUsers();
    return res.status(200).json(response);

  } catch (error) {
    return res.status(502).json({ // Base de Datos tiro un error
      error: 'Failed to fetch users',
      message: error.message,
    });
  }
}

async function httpGetUser(req, res) {
  const { id } = req.params;
  try {
    return res.status(200).json(await getUserById(id));
  } catch (error) {
    return res.status(502).json({ // Base de Datos tiro un error
      error: 'Failed to fetch users',
      message: error.message,
    });
  }
}

async function httpCreateUser(req, res) {
  const userData = formData.toObj(req.body);
  const imageFile = req?.files?.imageUrl;
  try {
    if (imageFile) {
      const imageExt = imageFile.name.split('.').at(-1);
      const imageName = `${randomUUID()}.${imageExt}`;

      const uploadUserImage = await uploadFileToBucket({
        filePath: imageFile.data,
        keyName: imageName,
        bucketName: 'elangel-datahub-images',
      }, {
        ContentEncoding: imageFile.encoding,
        ContentType: imageFile.mimetype
      })

      if (!uploadUserImage.ok) throw new Error(uploadUserImage.error);
      userData.imageUrl = `https://elangel-datahub-images.s3.amazonaws.com/${imageName}`
    }
    const userCreated = await createUser(userData);
    return res.status(201).json({
      ok: true
    });
  } catch (error) {
    if (error?.code) {
      const MONGO_ERR_CODES = {
        11000: `${Object.values(error?.keyValue || {})[0]} already exists`
      }
      return res.status(502).json({ // Base de Datos tiro un error
        error: 'Failed to create new user',
        message: MONGO_ERR_CODES[error.code] || error.message,
      });
    }

    return res.status(502).json({ // Base de Datos tiro un error
      error: 'Failed to create new user',
      message: error.message,
    });
  }
}

async function httpUpdateUserById(req, res) {
  const userId = req.params.id;
  const updateData = req.body;

  try {
    const userUpdated = await updateUserById(userId, updateData);
    return res.status(200).json({
      ok: true,
    });
  } catch (error) {
    return res.status(502).json({ // Base de datos tiro un error
      error: 'Failed to update user',
      message: error.message,
    });
  }
}

async function httpUpdateUserByEmail(req, res) {
  const email = req.params.email;
  const updateData = req.body;

  try {
    const userUpdated = await updateUserByEmail(email, updateData);
    return res.status(200).json({
      ok: true,
    });
  } catch (error) {
    return res.status(502).json({ // Base de datos tiro un error
      error: 'Failed to update user',
      message: error.message,
    });
  }
}

async function httpDeleteUserByEmail(req, res) {
  const { email } = req.params;

  try {
    const deletedUser = await deleteUserByEmail(email)
    const imageStoredInBucket = deletedUser?.imageUrl && deletedUser.imageUrl.includes('elangel-datahub-images');
    if (imageStoredInBucket) {
      await deleteFileFromBucket({
        keyName: deletedUser.imageUrl.split("/").at(-1),
        bucketName: 'elangel-datahub-images',
      });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(502).json({ // Base de datos tiro un error
      error: 'Failed to delete user',
      message: error.message,
    });
  }
}

async function httpChangePassword(req, res) {
  const { oldPassword, newPassword } = req.body;

  // Obtenemos el perfil del usuario del checkUserAuth middleware
  const { userProfile } = res.locals;

  try {
    const userAccount = await getUserByEmail(userProfile.email);
    const oldPasswordMatch = await userAccount.comparePassword(oldPassword);
    if (!oldPasswordMatch) throw new Error('Incorrect password');

    userAccount.password = newPassword;
    const updatedUser = await userAccount.save(); // ! Solo usando .save() se activara la encriptacion de la nueva contraseña 
    return res.json({ ok: true });
  } catch (error) {
    return res.status(502).json({ // Base de datos tiro un error
      error: 'Failed to change password',
      message: error.message,
    });
  }
}

async function httpSetUserPassword(req, res) {
  const userId = req.params.id;
  const { password } = req.body;

  try {
    const userAccount = await getUserById(userId);
    userAccount.password = password;
    const updatedUser = await userAccount.save(); // ! Solo usando .save() se activara la encriptacion de la nueva contraseña 
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(502).json({ // Base de datos tiro un error
      error: 'Failed to update user',
      message: error.message,
    });
  }
}

module.exports = {
  httpGetAllUsers,
  httpGetUser,
  httpCreateUser,
  httpUpdateUserById,
  httpUpdateUserByEmail,
  httpDeleteUserByEmail,
  httpSetUserPassword,
  httpChangePassword
};
