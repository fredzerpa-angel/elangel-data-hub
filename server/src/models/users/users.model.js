const users = require('./users.mongo');

async function getAllUsers() {
  return await users.find({}, { password: 0 }).lean();
}

async function createUser(userData) {
  return await users.create(userData);
}

async function updateUserById(userId, updateData) {
  const options = {
    new: true, // Retorna el Estudiante con los datos actualizados
    runValidators: true, // Aplica las validaciones del User Schema otra vez
  };

  return await users.findByIdAndUpdate(userId, updateData, options);
}

async function updateUserByEmail(email, updateData) {
  const options = {
    new: true, // Retorna el Estudiante con los datos actualizados
    runValidators: true, // Aplica las validaciones del User Schema otra vez
  };

  return await users.findOneAndUpdate({ email: email }, updateData, options);
}

async function deleteUserByEmail(email) {
  return await users.findOneAndDelete({ email });
}

async function getUserById(id) {
  return await users.findById(id);
}

async function getUserByEmail(email) {
  return await users.findOne({ email });
}

async function userExists({ email }) {
  return await users.exists({ email });
}

async function getUserBySearch(search) {
  return await users
    .find({}, { password: 0 })
    .or([
      { email: new RegExp(search, 'gi') },
    ]).lean();
}

module.exports = {
  getAllUsers,
  createUser,
  updateUserById,
  updateUserByEmail,
  deleteUserByEmail,
  userExists,
  getUserById,
  getUserByEmail,
  getUserBySearch,
};
