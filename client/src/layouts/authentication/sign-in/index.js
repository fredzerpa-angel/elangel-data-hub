

import { useEffect, useState } from "react";

// react-router-dom components
import { useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import Separator from "layouts/authentication/components/Separator";

// Images
import logo from "assets/images/el-angel/logo.png"
import curved6 from "assets/images/curved-images/curved14.jpg";

import AuthApi from "../../../api/auth.api";

import { useAuth } from "context/auth.context";
import GoogleSocial from "../components/Socials/google";
import { CardMedia, FormControlLabel, Switch } from "@mui/material";

import linearGradient from "assets/theme/functions/linearGradient";
import { enqueueSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function SignIn() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: JSON.parse(window.localStorage.getItem("rememberSession")) || false,
    }
  });

  const onSubmit = async ({ email, password, rememberMe }) => {
    console.log({ email, password, rememberMe })
    try {
      setIsLoading(true);
      const { data } = await AuthApi.loginWithEmailAndPassword({ email, password, session: rememberMe })
      if (data.status >= 400) return enqueueSnackbar(data.message, { variant: "error" });
      setUser(data);
      return navigate("/dashboard");
    } catch (err) {
      if (err.response) return enqueueSnackbar(err.response.data.message, { variant: "error" });
      return enqueueSnackbar("Ha ocurrido un error", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [navigate, user])

  const renderPasswordVisibilityIcon = () => {
    return visiblePassword ?
      <Visibility />
      :
      <VisibilityOff />
  }

  return (
    <BasicLayout
      title={
        <>
          Bienvenido a {" "}
          <SoftTypography
            component="span"
            variant="inherit"
            sx={({ palette: { gradients } }) => ({
              background: linearGradient(gradients.info.state, "white", 0),
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            })}
          >
            El Angel DataHub
          </SoftTypography>
        </>
      }
      description="¡Visualiza los mejores reportes del Colegio El Angel!"
      image={curved6}
    >
      <Card sx={{ p: 4 }}>
        <CardMedia
          component="img"
          sx={{
            height: "10rem",
            objectFit: "contain",
            m: 0,
            mb: 2,
          }}
          image={logo}
        />
        <SoftBox display="flex" flexDirection="column" alignItems="center" mb={2}>
          <GoogleSocial />
        </SoftBox>
        <Separator text="o" />
        <SoftBox component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
          <SoftBox mb={2}>
            <SoftBox ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                Email
              </SoftTypography>
            </SoftBox>
            <SoftInput
              {...register("email", { required: "Este campo es obligatorio" })}
              type="email"
              error={!!errors?.email}
              placeholder="Email"
            />
            {!!errors?.email && <SoftTypography fontSize="small" color="error" fontWeight="light">{errors?.email.message}</SoftTypography>}
          </SoftBox>
          <SoftBox mb={2}>
            <SoftBox ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                Contraseña
              </SoftTypography>
            </SoftBox>
            <SoftInput
              {...register("password", { required: "Este campo es obligatorio" })}
              type={visiblePassword ? 'text' : 'password'}
              error={!!errors?.password}
              placeholder="Contraseña"
              icon={{
                component: renderPasswordVisibilityIcon(),
                direction: "right",
                onClick: () => setVisiblePassword(!visiblePassword),
              }}
            />
            {!!errors?.password && <SoftTypography fontSize="small" color="error" fontWeight="light">{errors?.password.message}</SoftTypography>}
          </SoftBox>
          <SoftBox display="flex" alignItems="center" ml={1}>
            <Controller
              control={control}
              name="rememberMe"
              render={({ field: { value, onChange, ...rest } }) => (
                <FormControlLabel
                  label={<SoftTypography variant="body2" fontWeight="regular" ml={1}>Recuerdame</SoftTypography>}
                  control={
                    <Switch
                      {...rest}
                      value={value}
                      checked={value}
                      onChange={(event, nextValue) => {
                        window.localStorage.setItem("rememberSession", nextValue);
                        return onChange(event, nextValue);
                      }}
                    />
                  }
                  sx={{
                    width: "fit-content"
                  }}
                />
              )}

            />
          </SoftBox>
          <SoftBox mt={4} mb={1}>
            <SoftButton loading={isLoading} type="submit" variant="gradient" color="info" fullWidth>
              {!isLoading && "Iniciar sesion"}
            </SoftButton>
          </SoftBox>
          <SoftBox mt={3} textAlign="center">
            <SoftTypography variant="button" color="text" fontWeight="regular">
              Si no posees una cuenta, por favor comunicate con Administracion El Angel.
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </Card>
    </BasicLayout>
  );
}

export default SignIn;
