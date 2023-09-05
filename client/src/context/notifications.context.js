import { createContext, useCallback, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./auth.context";
import createDebtApi from "api/debts.api";

const NotificationsContext = createContext(null);

export const NotificationsProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({ debts: [] });
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [errors, setErrors] = useState([]);

  const debtApiInstance = useCallback(() => createDebtApi(user.token), [user]);

  const getDebtsNotifications = useCallback(async () => {
    const { data } = await debtApiInstance().getDebtsNotifications();
    return data;
  }, [debtApiInstance]);

  const loadNotifications = useCallback(async () => {
    try {
      setLoadingNotifications(true);
      const debtsNotifications = user?.notifications?.debts?.onWatch ? await getDebtsNotifications() : [];
      setNotifications({
        debts: debtsNotifications,
      });
    } catch (err) {
      setErrors({
        type: 'Fetching notifications',
        errors: err.response,
      });
    } finally {
      setLoadingNotifications(false);
    }
  }, [getDebtsNotifications, user])

  useEffect(() => {
    // Al ser un context de react, este carga al inicio del render de la pagina
    // aun cuando no se esta logueado por lo que es necesario evitar acceder a la BD sin un usuario
    if (user) loadNotifications();
  }, [loadNotifications, user])

  return (
    <NotificationsContext.Provider value={{ notifications, setNotifications, loadingNotifications, errors }}>
      {children}
    </NotificationsContext.Provider>
  )
};

NotificationsProvider.propTypes = {
  children: PropTypes.any,
};

export const useNotifications = () => useContext(NotificationsContext);
