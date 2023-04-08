import axios from 'axios';

const API_SERVER = (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_BACKEND_API_URL : '');

const createEventApi = (token) => {
  const eventsApiInstance = axios.create({
    // `baseURL` will be prepended to `url` unless `url` is absolute.
    baseURL: `${API_SERVER}/api/events/`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    timeout: 20000,
  });

  return ({
    getAllEvents: async () => {
      return await eventsApiInstance({
        method: 'GET',
      });
    },
    getEventById: async (eventId) => {
      return await eventsApiInstance({
        method: 'GET',
        url: eventId,
      });
    },
    createEvent: async (eventData) => {
      return await eventsApiInstance({
        method: 'POST',
        data: eventData,
      });
    },
    updateEventById: async (eventId, eventUpdatedData) => {
      return await eventsApiInstance({
        method: 'PUT',
        url: eventId,
        data: eventUpdatedData,
      });
    },
    deleteEventById: async (eventId) => {
      return await eventsApiInstance({
        method: 'DELETE',
        url: eventId,
      });
    }
  })
};

export default createEventApi;
