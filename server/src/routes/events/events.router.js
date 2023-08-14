const express = require('express');
const {
  httpGetAllEvents,
  httpCreateEvent,
  httpUpdateEvent,
  httpDeleteEvent,
  httpGetEvent,
} = require('./events.controller');

const eventsRouter = express.Router();

// * Tomar en cuenta el orden de las rutas, ya que la respuesta dependera de cual coincida primero
eventsRouter.get('/:id', httpGetEvent);
eventsRouter.get('/', httpGetAllEvents);

eventsRouter.put('/:id', httpUpdateEvent);

eventsRouter.post('/', httpCreateEvent);

eventsRouter.delete('/:id', httpDeleteEvent);

module.exports = eventsRouter;
