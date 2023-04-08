import axios from 'axios';

const API_SERVER = (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_BACKEND_API_URL : '');

const createEmployeeApi = (token) => {
  const employeesApiInstance = axios.create({
    // `baseURL` will be prepended to `url` unless `url` is absolute.
    baseURL: `${API_SERVER}/api/employees/`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    timeout: 20000,
  });

  return ({
    getAllEmployees: async () => {
      return await employeesApiInstance({
        method: 'GET',
      });
    },
    getEmployeeById: async (employeeId) => {
      return await employeesApiInstance({
        method: 'GET',
        url: employeeId,
      });
    },
    createEmployee: async (employeeData) => {
      return await employeesApiInstance({
        method: 'POST',
        data: employeeData,
      });
    },
    updateEmployeeById: async (employeeId, employeeUpdatedData) => {
      return await employeesApiInstance({
        method: 'PUT',
        url: employeeId,
        data: employeeUpdatedData,
      });
    },
    deleteEmployeeById: async (employeeId) => {
      return await employeesApiInstance({
        method: 'DELETE',
        url: employeeId,
      });
    }
  })
};

export default createEmployeeApi;
