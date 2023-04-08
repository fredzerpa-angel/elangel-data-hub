import axios from 'axios';

const API_SERVER = (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_BACKEND_API_URL : '');

const createStudentApi = (token) => {
  const studentsApiInstance = axios.create({
    // `baseURL` will be prepended to `url` unless `url` is absolute.
    baseURL: `${API_SERVER}/api/students/`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    timeout: 20000,
  });

  return ({
    getAllStudents: async () => {
      return await studentsApiInstance({
        method: 'GET',
      });
    },
    getStudentById: async (studentId) => {
      return await studentsApiInstance({
        method: 'GET',
        url: studentId,
      });
    },
    createStudent: async (studentData) => {
      return await studentsApiInstance({
        method: 'POST',
        data: studentData,
      });
    },
    updateStudentById: async (studentId, studentUpdatedData) => {
      return await studentsApiInstance({
        method: 'PUT',
        url: studentId,
        data: studentUpdatedData,
      });
    },
    deleteStudentById: async (studentId) => {
      return await studentsApiInstance({
        method: 'DELETE',
        url: studentId,
      });
    }
  })
};

export default createStudentApi;
