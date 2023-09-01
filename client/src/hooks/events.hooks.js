import { useCallback, useEffect, useState } from "react";
import { useAuth } from "context/auth.context";
import createEventApi from "../api/events.api";
import { DateTime } from "luxon";

const useEvents = () => {
  const [events, setEvents] = useState([]);
  const { user } = useAuth();

  const eventApiInstance = useCallback(() => createEventApi(user.token), [user.token]);

  const getEvents = useCallback(async () => {
    const { data } = await eventApiInstance().getAllEvents();
    data.forEach(event => {
      event.start = DateTime.fromJSDate(new Date(event?.start)).toISODate();
      event.end = DateTime.fromJSDate(new Date(event?.end)).toISODate();

      if (DateTime.fromISO(event?.end).diffNow().as("milliseconds") < 0 && event.status === "Pendiente") {
        event.status = "Completado"
      }
    })
    return setEvents(data);
  }, [eventApiInstance])

  useEffect(() => {
    getEvents();
  }, [getEvents])

  const getEventById = useCallback(async (eventId) => {
    const { data } = await eventApiInstance().getEventById(eventId);
    return data;
  }, [eventApiInstance])

  const createEvent = useCallback(async (eventData) => {
    try {
      const { data } = await eventApiInstance().createEvent(eventData);
      await getEvents();
      return data;
    } catch (err) {
      const { error, message } = err.response.data;
      return {
        error,
        message,
      }
    }
  }, [getEvents, eventApiInstance])

  const updateEventById = useCallback(async (eventId, eventData) => {
    try {
      const { data } = await eventApiInstance().updateEventById(eventId, eventData);
      await getEvents()
      return data;
    } catch (err) {
      return err.response.data;
    }
  }, [getEvents, eventApiInstance])

  const deleteEventById = useCallback(async (eventId) => {
    try {
      const { data } = await eventApiInstance().deleteEventById(eventId);
      await getEvents()
      return data;
    } catch (err) {
      return err.response.data;
    }
  }, [getEvents, eventApiInstance])



  return {
    events,
    getEvents,
    getEventById,
    createEvent,
    updateEventById,
    deleteEventById,
  }
}

export default useEvents;