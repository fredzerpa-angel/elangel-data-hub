import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { GoogleOAuthProvider } from "@react-oauth/google";

const AuthContext = createContext(null);

export const AuthProvider = ({ userData, children }) => {
  const [user, setUser] = useState(userData?.profile);
  const [token, setToken] = useState(userData?.token);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        {children}
      </GoogleOAuthProvider>
    </AuthContext.Provider>
  )
};

AuthProvider.propTypes = {
  userData: PropTypes.any,
  children: PropTypes.any,
};

export const useAuth = () => useContext(AuthContext);
