import { useCallback, useEffect, useState } from "react";
import { useAuth } from "context/auth.context";
import createEmployeeApi from "api/employees.api";

const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const { user } = useAuth();

  const employeeApiInstance = useCallback(() => createEmployeeApi(user.token), [user.token]);

  const getEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await employeeApiInstance().getAllEmployees();
      return setEmployees(data);
    } catch (error) {
      setErrors(error);
    } finally {
      setIsLoading(false);
    }
  }, [employeeApiInstance])

  useEffect(() => {
    console.log({ employees })
  }, [employees])

  useEffect(() => {
    getEmployees();
  }, [getEmployees])

  const getEmployeeById = useCallback(async (employeeId) => {
    const { data } = await employeeApiInstance().getEmployeeById(employeeId);
    return data;
  }, [employeeApiInstance])

  const createEmployee = useCallback(async (employeeData) => {
    try {
      const { data } = await employeeApiInstance().createEmployee(employeeData);
      await getEmployees();
      return data;
    } catch (err) {
      const { error, message } = err.response.data;
      return {
        error,
        message,
      }
    }
  }, [getEmployees, employeeApiInstance])

  const updateEmployeeById = useCallback(async (employeeId, employeeData) => {
    try {
      const { data } = await employeeApiInstance().updateEmployeeById(employeeId, employeeData);
      await getEmployees()
      return data;
    } catch (err) {
      return err.response.data;
    }
  }, [getEmployees, employeeApiInstance])

  const deleteEmployeeById = useCallback(async (employeeId) => {
    try {
      const { data } = await employeeApiInstance().deleteEmployeeById(employeeId);
      await getEmployees()
      return data;
    } catch (err) {
      return err.response.data;
    }
  }, [getEmployees, employeeApiInstance])



  return {
    employees,
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployeeById,
    deleteEmployeeById,
    isLoading,
    errors,
  }
}

export default useEmployees;