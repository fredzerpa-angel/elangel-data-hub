const events = require('./events.mongo');

async function getAllEvents() {
  return await events.find().lean();
}

async function createEvent(eventData) {
  return await events.create(eventData);
}

async function updateEvent(eventId, updateData) {
  const options = {
    new: true, // Retorna el evento con los datos actualizados
    runValidators: true, // Aplica las validaciones del Events Schema otra vez
  };

  return await events.findByIdAndUpdate(eventId, updateData, options);
}

async function deleteEvent(eventId) {
  return await events.findByIdAndDelete(eventId);
}

async function getEventById(eventId) {
  return await events.findById(eventId);
}

async function getEventBySearch(search) {
  return await events
    .find()
    .or([
      { type: new RegExp(search, 'gi') },
      { name: new RegExp(search, 'gi') },
      { organization: new RegExp(search, 'gi') },
    ]).lean();
}

// @bundle: Array[Object{Student}]
// Recibe un array de objetos donde crea un key con los matchfields para encontrarlo en la coleccion
async function upsertEventsByBundle(bundle) {
  return await events.upsertMany(bundle, {
    matchFields: ['_id'], // Compara los docs mediante este campo
    ensureModel: true, // Valida la data por el Schema
  });
}

module.exports = {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  getEventBySearch,
  upsertEventsByBundle
};
