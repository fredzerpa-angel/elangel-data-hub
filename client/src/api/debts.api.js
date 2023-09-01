import axios from 'axios';

const API_SERVER = (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_BACKEND_API_URL : '');

const createDebtApi = (token) => {
  const debtsApiInstance = axios.create({
    // `baseURL` will be prepended to `url` unless `url` is absolute.
    baseURL: `${API_SERVER}/api/debts/`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    timeout: 20000,
  });

  return ({
    getAllDebts: async () => {
      return await debtsApiInstance({
        method: 'GET',
      });
    },
    getDebtById: async (debtId) => {
      return await debtsApiInstance({
        method: 'GET',
        url: debtId,
      });
    },
    getDebtsNotifications: async () => {
      return await debtsApiInstance({
        method: 'GET',
        url: 'notifications',
      })
    },
  })
};

export default createDebtApi;
