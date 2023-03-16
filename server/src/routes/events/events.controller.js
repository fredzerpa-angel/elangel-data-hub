const {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  getEventBySearch,
} = require('../../models/events/events.model');

async function httpGetAllEvents(req, res) {
  const { search } = req.query;

  // TODO: Implementar las validaciones

  try {
    const response = await getEventBySearch(search);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(502).json({ // Base de Datos tiro un error
      error: 'Failed to fetch events',
      message: error.message,
    });
  }
}

async function httpGetEvent(req, res) {
  const { id } = req.params;
  // TODO: Implementar las validaciones
  try {
    return res.status(200).json(await getEventById(id));
  } catch (error) {
    return res.status(502).json({ // Base de Datos tiro un error
      error: 'Failed to fetch events',
      message: error.message,
    });
  }
}

async function httpCreateEvent(req, res) {
  const eventData = req.body;

  // TODO: Implementar las validaciones

  try {
    return res.status(201).json(await createEvent(eventData));
  } catch (error) {
    return res.status(502).json({ // Base de Datos tiro un error
      error: 'Failed to create new event',
      message: error.message,
    });
  }
}

async function httpUpdateEvent(req, res) {
  const eventId = req.params.id;
  const updateData = req.body;

  // TODO: Implementar validaciones

  try {
    return res.status(200).json(await updateEvent(eventId, updateData));
  } catch (error) {
    return res.status(502).json({ // Base de datos tiro un error
      error: 'Failed to update event',
      message: error.message,
    });
  }
}

async function httpDeleteEvent(req, res) {
  const eventId = req.params.id;

  // TODO: Implementar validaciones
  try {
    return res.status(200).json(await deleteEvent(eventId));
  } catch (error) {
    return res.status(502).json({ // Base de datos tiro un error
      error: 'Failed to delete event',
      message: error.message,
    });
  }
}

module.exports = {
  httpGetAllEvents,
  httpGetEvent,
  httpCreateEvent,
  httpUpdateEvent,
  httpDeleteEvent,
};
