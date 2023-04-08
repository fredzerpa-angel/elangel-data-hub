import { useCallback, useEffect, useState } from "react";
import { useAuth } from "context/auth.context";
import createUserApi from "../api/users.api";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const { user, setUser } = useAuth();

  const userApiInstance = useCallback(() => createUserApi(user.token), [user.token]);

  const getUsers = useCallback(async () => {
    const { data } = await userApiInstance().getAllUsers();
    setUsers(data);
  }, [userApiInstance])

  useEffect(() => {
    console.log({ users })
  }, [users])

  useEffect(() => {
    getUsers();
  }, [getUsers])

  const getUserById = useCallback(async (userId) => {
    try {
      const { data } = await userApiInstance().getUserById(userId);
      return data;
    } catch (err) {
      return err.response.data;
    }
  }, [userApiInstance])

  const createUser = useCallback(async (userData) => {
    try {
      const { data } = await userApiInstance().createUser(userData);
      await getUsers();
      return data;
    } catch (err) {
      return err.response.data;
    }
  }, [getUsers, userApiInstance])

  const updateUserByEmail = useCallback(async (userEmail, userData) => {
    try {
      const { data } = await userApiInstance().updateUserByEmail(userEmail, userData);
      await getUsers()
      return data;
    } catch (err) {
      return err.response.data;
    }
  }, [getUsers, userApiInstance])

  const deleteUserByEmail = useCallback(async (userEmail) => {
    try {
      const { data } = await userApiInstance().deleteUserByEmail(userEmail);
      await getUsers()
      return data;
    } catch (err) {
      return err.response.data;
    }
  }, [getUsers, userApiInstance])

  const updateSelfData = useCallback(async (userData) => {
    try {
      delete userData.isAdmin; // User cannot self update this property
      delete userData.privileges; // User cannot self update this property
      delete userData.password; // This property is not updated here
      const { data } = await userApiInstance().updateSelfUser(userData);
      setUser(data);
      return data;
    } catch (err) {
      return err.response.data;
    }
  }, [setUser, userApiInstance])

  const changePassword = useCallback(async (oldPassword, newPassword) => {
    try {
      const { data } = await userApiInstance().changePassword(oldPassword, newPassword);
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
    updateSelfData,
    deleteUserByEmail,
    changePassword,
  }
}

export default useUsers;