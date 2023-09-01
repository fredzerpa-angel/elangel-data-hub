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
    getStudents();
  }, [getStudents])

  const getStudentById = useCallback(async (eventId) => {
    const { data } = await eventApiInstance().getStudentById(eventId);
    return data;
  }, [eventApiInstance])

  return {
    students,
    getStudents,
    getStudentById,
  }
}

export default useStudents;