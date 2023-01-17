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

module.exports = {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  getEventBySearch,
};
