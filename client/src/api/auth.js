import axios from 'axios';

const API_SERVER = (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_BACKEND_API_URL : '') + '/api/auth';

const AuthApi = {
  loginWithEmailAndPassword: async (data) => {
    return await axios.post(`${API_SERVER}/login`, data);
  },
  loginWithGoogle: async (token) => {
    return await axios.post(`${API_SERVER}/google`, { token });
  },
  registerWithEmailAndPassword: async (data) => {
    return await axios.post(`${API_SERVER}/register`, data);
  },
  checkSession: async () => {
    return await axios.post(`${API_SERVER}/session`);
  },
  logout: async () => {
    return await axios.post(`${API_SERVER}/logout`);
  }
}

export default AuthApi;
