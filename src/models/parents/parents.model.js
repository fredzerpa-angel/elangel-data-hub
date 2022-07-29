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
  return await parents
    .find()
    .or([
      { fullname: new RegExp(search, 'gi') },
      { documentId: new RegExp(search, 'gi') },
    ]);
}

async function getParentByDocumentId(documentId) {
  return await parents.findOne({ documentId: { number: documentId } });
}

async function upsertParentsByBundle(bundle) {
  return await parents.upsertMany(bundle, {
    matchFields: ['documentId.number'], // Compara los docs mediante este campo
    ensureModel: true, // Valida la data por el Schema
  });
}

module.exports = {
  getAllParents,
  createParent,
  updateParent,
  deleteParent,
  getParentById,
  getParentBySearch,
  getParentByDocumentId,
  upsertParentsByBundle,
};
