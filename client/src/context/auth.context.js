import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthApi from "api/auth";
import LoadingPage from "components/LoadingPage";

const AuthContext = createContext(null);

export const AuthProvider = ({ userData, children }) => {
  const [user, setUser] = useState(userData);
  const [loadingSession, setLoadingSession] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoadingSession(true);
    (async () => {
      try {
        setTimeout(() => { setError({ type: 'Connection unstable', error: 'Bad internet connection' }) }, 10000);
        const { data: userSession } = await AuthApi.checkSession();
        setUser(userSession);
      } catch (err) {
        console.log(err);
        setError({
          type: 'Fetching Session',
          error: err.response,
        });
      }
      setLoadingSession(false);
    })();
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        {
          loadingSession ?
            <LoadingPage message={error?.type === 'Connection unstable' ? 'Conexion a internet inestable' : ''} />
            :
            children
        }
      </GoogleOAuthProvider>
    </AuthContext.Provider>
  )
};

AuthProvider.propTypes = {
  userData: PropTypes.any,
  children: PropTypes.any,
};

export const useAuth = () => useContext(AuthContext);
