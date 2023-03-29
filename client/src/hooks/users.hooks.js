import { useCallback, useEffect, useState } from "react";
import { useAuth } from "context/auth.context";
import createUserApi from "../api/users.api";


const useUsers = () => {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  const userApiInstance = createUserApi(user.token);

  const getUsers = useCallback(async () => {
    const { data } = await userApiInstance.getAllUsers();
    return data;
  }, [userApiInstance])

  useEffect(() => {
    console.log({ users })
  }, [users])

  const getUserById = useCallback(async (userId) => {
    const { data } = await userApiInstance.getUserById(userId);
    return data;
  }, [userApiInstance])

  const createUser = useCallback(async (userData) => {
    try {
      const { data } = await userApiInstance.createUser(userData);
      return data;
    } catch (err) {
      const { error, message } = err.response.data;
      return {
        error,
        message,
      }
    }
  }, [userApiInstance])

  const updateUserByEmail = useCallback(async (userEmail, userData) => {
    try {
      const { data } = await userApiInstance.updateUserByEmail(userEmail, userData);
      return data;
    } catch (err) {
      return err.response.data;
    }
  }, [userApiInstance])

  const deleteUserByEmail = useCallback(async (userEmail) => {
    try {
      const { data } = await userApiInstance.deleteUserByEmail(userEmail);
      return data;
    } catch (err) {
      return err.response.data;
    }
  }, [userApiInstance])

  const changePassword = useCallback(async (oldPassword, newPassword) => {
    try {
      const { data } = await userApiInstance.changePassword(oldPassword, newPassword);
      return data;
    } catch (err) {
      return err.response.data;
    }
  }, [userApiInstance])

  return {
    users,
    getUsers,
    getUserById,
    createUser,
    updateUserByEmail,
    deleteUserByEmail,
    changePassword,
  }
}

export default useUsers;