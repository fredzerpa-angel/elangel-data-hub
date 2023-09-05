import { createContext, useCallback, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./auth.context";
import createPaymentApi from "api/payments.api";

const PaymentsContext = createContext(null);

export const PaymentsProvider = ({ children }) => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  const paymentsApiInstance = useCallback(() => createPaymentApi(user.token), [user]);

  const getPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: payments } = await paymentsApiInstance().getAllPayments();
      return payments;
    } catch (err) {
      setErrors({
        type: 'Fetching payments',
        error: err.response,
      });
    } finally {
      setIsLoading(false);
    }
  }, [paymentsApiInstance]);

  const loadPayments = useCallback(async () => {
    setPayments(await getPayments());
  }, [getPayments])

  const getPaymentById = useCallback(async (paymentId) => {
    try {
      setIsLoading(true);
      const { data } = await paymentsApiInstance().getPaymentById(paymentId);
      return data;
    } catch (err) {
      setErrors(err);
    } finally {
      setIsLoading(false);
    }
  }, [paymentsApiInstance])

  useEffect(() => {
    // Al ser un context de react, este carga al inicio del render de la pagina
    // aun cuando no se esta logueado por lo que es necesario evitar acceder a la BD sin un usuario
    if (user) loadPayments();
  }, [loadPayments, user])

  return (
    <PaymentsContext.Provider value={{ payments, setPayments, getPaymentById, isLoading, errors }}>
      {children}
    </PaymentsContext.Provider>
  )
};

PaymentsProvider.propTypes = {
  children: PropTypes.any,
};

export const usePayments = () => useContext(PaymentsContext);
