const parents = require('./parents.mongo');

async function getAllParents() {
  return await parents.find({});
}

async function createParent(parentData) {
  return await parents.create(parentData);
}

async function updateParent(parentId, updateData) {
  const options = {
    new: true, // Retorna el Padre con los datos actualizados
    runValidators: true, // Aplica las validaciones del Parent Schema otra vez
  };

  return await parents.findByIdAndUpdate(parentId, updateData, options);
}

async function deleteParent(parentId) {
  return await parents.findByIdAndDelete(parentId);
}

async function getParentById(parentId) {
  return await parents.findById(parentId);
}

async function getParentBySearch(search) {
  return await parents.find()
  .or([
    { fullname: new RegExp(search, 'gi') },
    { cedulaId: new RegExp(search, 'gi') },
  ]);
}

module.exports = {
  getAllParents,
  createParent,
  updateParent,
  deleteParent,
  getParentById,
  getParentBySearch,
};
