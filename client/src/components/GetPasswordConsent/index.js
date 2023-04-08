import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import SoftButton from 'components/SoftButton';
import { useForm } from 'react-hook-form';
import SoftInput from 'components/SoftInput';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import { InfoOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from 'context/auth.context';
import createUserApi from 'api/users.api';
import { confirmable } from 'react-confirm';
import PropTypes from 'prop-types';
import { createConfirmation } from 'context/confirmation.context';

const GetPasswordConsent = ({ title = "confirmacion", description, warning, show, proceed, dismiss, cancel }) => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      password: "",
    }
  });
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async ({ password }) => {
    try {
      setIsLoading(true);
      const { confirmPassword } = createUserApi(user.token);
      const { data } = await confirmPassword(password);
      return proceed(data);
    } catch (err) {
      return proceed(err.response.data);
    } finally {
      setIsLoading(false);
    }
  }

  const renderPasswordVisibilityIcon = () => {
    return visiblePassword ?
      <Visibility />
      :
      <VisibilityOff />
  }

  return (
    <Dialog open={show} onClose={dismiss} maxWidth="xs">
      <DialogTitle component="div">
        <SoftTypography variant="subtitle1" textTransform="capitalize">
          {title}
        </SoftTypography>
      </DialogTitle>
      <DialogContent>
        <SoftTypography variant="body2" fontWeight="regular" color="text" paragraph>
          {description}
        </SoftTypography>
        <SoftBox component="form" onSubmit={handleSubmit(onSubmit)}>
          <SoftBox mb={2}>
            <SoftBox ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                Contraseña*
              </SoftTypography>
            </SoftBox>
            <SoftInput
              type={visiblePassword ? 'text' : 'password'}
              {...register(
                "password",
                {
                  required: {
                    value: true,
                    message: "Este campo es obligatorio",
                  },
                  minLength: {
                    value: 8,
                    message: "La contraseña debe contener al menos 8 caracteres"
                  }
                }
              )}
              autoFocus
              error={!!errors?.password}
              placeholder="Contraseña"
              icon={{
                component: renderPasswordVisibilityIcon(),
                direction: "right",
                onClick: () => setVisiblePassword(!visiblePassword),
              }}
            />
            {errors?.password && <SoftTypography fontSize="small" color="error" fontWeight="light">{errors?.password.message}</SoftTypography>}
          </SoftBox>

          <SoftBox mb={2}>
            {
              typeof warning === "string" ?
                (
                  <SoftTypography variant="caption" fontWeight="light" color="error">
                    <InfoOutlined /> {warning}
                  </SoftTypography>
                )
                :
                warning
            }
          </SoftBox>

          <SoftBox mb={2} display="flex" justifyContent="flex-end" gap={3}>
            <SoftButton color="dark" variant="text" onClick={dismiss} sx={{ alignSelf: "center" }}>Cancelar</SoftButton>
            <SoftButton loading={isLoading} color="info" variant="gradient" type="submit">Continuar</SoftButton>
          </SoftBox>

        </SoftBox>
      </DialogContent>
    </Dialog>
  );
}

GetPasswordConsent.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  warning: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  show: PropTypes.bool, // from confirmable. indicates if the dialog is shown or not.
  proceed: PropTypes.func, // from confirmable. call to close the dialog with promise resolved.
  confirmation: PropTypes.string, // arguments of your confirm function
  options: PropTypes.object // arguments of your confirm function
}

// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component.
export default createConfirmation(confirmable(GetPasswordConsent));