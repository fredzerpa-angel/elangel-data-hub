import { createContext, useCallback, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./auth.context";
import createDebtApi from "api/debts.api";

const DebtsContext = createContext(null);

export const DebtsProvider = ({ children }) => {
  const { user } = useAuth();
  const [debts, setDebts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  const debtApiInstance = useCallback(() => createDebtApi(user.token), [user.token]);

  const getDebts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: debts } = await debtApiInstance().getAllDebts();
      return debts
    } catch (err) {
      setErrors({
        type: 'Fetching debts',
        error: err.response,
      });
    } finally {
      setIsLoading(false);
    }
  }, [debtApiInstance]);

  const loadDebts = useCallback(async () => {
    setDebts(await getDebts());
  }, [getDebts])

  const getDebtById = useCallback(async (debtId) => {
    try {
      setIsLoading(true);
      const { data } = await debtApiInstance().getDebtById(debtId);
      return data;
    } catch (err) {
      setErrors(err);
    } finally {
      setIsLoading(false);
    }
  }, [debtApiInstance])

  useEffect(() => {
    // Al ser un context de react, este carga al inicio del render de la pagina
    // aun cuando no se esta logueado por lo que es necesario evitar acceder a la BD sin un usuario
    if (user) loadDebts();
  }, [loadDebts, user])

  return (
    <DebtsContext.Provider value={{ debts, setDebts, getDebtById, isLoading, errors }}>
      {children}
    </DebtsContext.Provider>
  )
};

DebtsProvider.propTypes = {
  children: PropTypes.any,
};

export const useDebts = () => useContext(DebtsContext);
