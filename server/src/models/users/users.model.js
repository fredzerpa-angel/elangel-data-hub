const users = require('./users.mongo');

async function getAllUsers() {
  return await users.find().lean();
}

async function createUser(userData) {
  return await users.create(userData);
}

async function updateUser(userId, updateData) {
  const options = {
    new: true, // Retorna el Estudiante con los datos actualizados
    runValidators: true, // Aplica las validaciones del User Schema otra vez
  };

  return await users.findByIdAndUpdate(userId, updateData, options);
}

async function deleteUser(userId) {
  return await users.findByIdAndDelete(userId);
}

async function getUserByEmail(email) {
  return await users.findOne({ email });
}

async function userExists({ email }) {
  return await users.exists({ email });
}

async function getUserBySearch(search) {
  return await users
    .find()
    .or([
      { email: new RegExp(search, 'gi') },
    ]).lean();
}

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  userExists,
  getUserByEmail,
  getUserBySearch,
};
