import React, { useEffect } from "react";
import { useAuth } from './context/auth.context';
import { useNavigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.token || user.token === "") {
      navigate("/authentication/sign-in")
    }
  }, [navigate, user])

  return (
    <>
      <Outlet />
    </>
  );
};
