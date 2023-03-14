import axios from "./index";

const API_SERVER = process.env.REACT_APP_BACKEND_SERVER;

const AuthApi = {
  loginWithEmailAndPassword: async (data) => {
    return await axios.post(`${API_SERVER}/auth/login`, data);
  },
  loginWithGoogle: async (token) => {
    const user = await axios.post(`${API_SERVER}/auth/google`, token);
    return user;
  },
  registerWithEmailAndPassword: async (data) => {
    return await axios.post(`${API_SERVER}/auth/register`, data);
  },
  logout: async (data) => {
    return await axios.post(`${API_SERVER}/auth/logout`, data, {
      headers: { Authorization: `${data.token}` },
    })
  }
}

export default AuthApi;
