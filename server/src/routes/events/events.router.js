const express = require('express');
const {
  httpGetAllEvents,
  httpCreateEvent,
  httpUpdateEvent,
  httpDeleteEvent,
  httpGetEvent,
} = require('./events.controller');

const eventsRouter = express.Router();

eventsRouter.get('/', httpGetAllEvents);
eventsRouter.get('/:id', httpGetEvent);
eventsRouter.post('/', httpCreateEvent);
eventsRouter.patch('/:id', httpUpdateEvent);
eventsRouter.delete('/:id', httpDeleteEvent);

module.exports = eventsRouter;
