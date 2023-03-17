import axios from 'axios';

const API_SERVER = 'api/auth';

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
  logout: async () => {
    return await axios.post(`${API_SERVER}/logout`);
  }
}

export default AuthApi;
