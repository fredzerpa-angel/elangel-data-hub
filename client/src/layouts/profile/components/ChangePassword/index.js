

import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

import useUsers from "hooks/users.hooks";
import { useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function ChangePassword() {
  const { changePassword } = useUsers();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: ""
    }
  })
  const [visibleOldPassword, setVisibleOldPassword] = useState(false);
  const [visibleNewPassword, setVisibleNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  
  const onSubmit = async ({ oldPassword, newPassword }) => {
    try {
      setIsLoading(true);
      const response = await changePassword(oldPassword, newPassword);
      if (!response?.ok) {
        return enqueueSnackbar(response.message, { variant: "error" });
      }
      enqueueSnackbar("Su clave se ha cambiado exitosamente", { variant: "success" })
    } catch (err) {
      return enqueueSnackbar(err.message, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  }

  const renderPasswordVisibilityIcon = (visible) => {
    return visible ?
      <Visibility />
      :
      <VisibilityOff />
  }

  return (
    <Card sx={{ p: 2 }}>
      <SoftBox>
        <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize" >
          Cambiar contraseña
        </SoftTypography>
        <SoftTypography variant="button" fontWeight="regular" color="text" paragraph>
          Si ha olvidado su contraseña, por favor comuniquese con administracion
        </SoftTypography>
      </SoftBox>
      <SoftBox component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
              Contraseña actual
            </SoftTypography>
          </SoftBox>
          <SoftInput
            {...register("oldPassword", {
              required: "Este campo es obligatorio",
              minLength: { value: 8, message: "La contraseña debe contener al menos 8 caracteres" }
            })}
            placeholder="Contraseña Actual"
            error={!!errors?.oldPassword}
            type={visibleOldPassword ? 'text' : 'password'}
            icon={{
              component: renderPasswordVisibilityIcon(visibleOldPassword),
              direction: "right",
              onClick: () => setVisibleOldPassword(!visibleOldPassword),
            }}
          />
          {!!errors?.oldPassword &&
            <SoftTypography fontSize="small" color="error" fontWeight="light">
              {errors?.oldPassword.message}
            </SoftTypography>
          }
        </SoftBox>
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
              Nueva contraseña
            </SoftTypography>
          </SoftBox>
          <SoftInput
            {...register("newPassword", {
              required: "Este campo es obligatorio",
              minLength: { value: 8, message: "La contraseña debe contener al menos 8 caracteres" }
            })}
            placeholder="Nueva Contraseña"
            error={!!errors?.newPassword}
            type={visibleNewPassword ? 'text' : 'password'}
            icon={{
              component: renderPasswordVisibilityIcon(visibleNewPassword),
              direction: "right",
              onClick: () => setVisibleNewPassword(!visibleNewPassword),
            }}
          />
          {!!errors?.newPassword &&
            <SoftTypography fontSize="small" color="error" fontWeight="light">
              {errors?.newPassword.message}
            </SoftTypography>
          }
        </SoftBox>
        <SoftBox mt={4} mb={1}>
          <SoftButton loading={isLoading} type="submit" variant="gradient" color="info" fullWidth>
            {!isLoading && "Cambiar contraseña"}
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

export default ChangePassword;
