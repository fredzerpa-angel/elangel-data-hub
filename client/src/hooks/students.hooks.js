import { useCallback, useEffect, useState } from "react";
import { useAuth } from "context/auth.context";
import createStudentApi from "../api/students.api";

const useStudents = () => {
  const [students, setStudents] = useState([]);
  const { user } = useAuth();

  const eventApiInstance = useCallback(() => createStudentApi(user.token), [user.token]);

  const getStudents = useCallback(async () => {
    const { data } = await eventApiInstance().getAllStudents();
    return setStudents(data);
  }, [eventApiInstance])

  useEffect(() => {
    console.log({ students })
  }, [students])

  useEffect(() => {
    getStudents();
  }, [getStudents])

  const getStudentById = useCallback(async (eventId) => {
    const { data } = await eventApiInstance().getStudentById(eventId);
    return data;
  }, [eventApiInstance])

  const createStudent = useCallback(async (eventData) => {
    try {
      const { data } = await eventApiInstance().createStudent(eventData);
      await getStudents();
      return data;
    } catch (err) {
      const { error, message } = err.response.data;
      return {
        error,
        message,
      }
    }
  }, [getStudents, eventApiInstance])

  const updateStudentById = useCallback(async (eventId, eventData) => {
    try {
      const { data } = await eventApiInstance().updateStudentById(eventId, eventData);
      await getStudents()
      return data;
    } catch (err) {
      return err.response.data;
    }
  }, [getStudents, eventApiInstance])

  const deleteStudentById = useCallback(async (eventId) => {
    try {
      const { data } = await eventApiInstance().deleteStudentById(eventId);
      await getStudents()
      return data;
    } catch (err) {
      return err.response.data;
    }
  }, [getStudents, eventApiInstance])



  return {
    students,
    getStudents,
    getStudentById,
    createStudent,
    updateStudentById,
    deleteStudentById,
  }
}

export default useStudents;