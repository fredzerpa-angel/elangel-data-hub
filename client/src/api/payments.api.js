import axios from 'axios';

const API_SERVER = (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_BACKEND_API_URL : '');

const createPaymentApi = (token) => {
  const paymentsApiInstance = axios.create({
    // `baseURL` will be prepended to `url` unless `url` is absolute.
    baseURL: `${API_SERVER}/api/payments/`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    timeout: 30000,
  });

  return ({
    getAllPayments: async () => {
      return await paymentsApiInstance({
        method: 'GET',
      });
    },
    getPaymentById: async (paymentId) => {
      return await paymentsApiInstance({
        method: 'GET',
        url: paymentId,
      });
    },
  })
};

export default createPaymentApi;
