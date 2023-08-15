const express = require('express');
const {
  httpGetAllEvents,
  httpCreateEvent,
  httpUpdateEvent,
  httpDeleteEvent,
  httpGetEvent,
} = require('./events.controller');
const { checkUserPrivilegesAccess } = require('../auth/auth.utils');

const eventsRouter = express.Router();

// * Tomar en cuenta el orden de las rutas, ya que la respuesta dependera de cual coincida primero
eventsRouter.get('/:id', checkUserPrivilegesAccess('events', 'read'), httpGetEvent);
eventsRouter.get('/', checkUserPrivilegesAccess('events', 'read'), httpGetAllEvents);

eventsRouter.put('/:id', checkUserPrivilegesAccess('events', 'upsert'), httpUpdateEvent);

eventsRouter.post('/', checkUserPrivilegesAccess('events', 'upsert'), httpCreateEvent);

eventsRouter.delete('/:id', checkUserPrivilegesAccess('events', 'delete'), httpDeleteEvent);

module.exports = eventsRouter;
