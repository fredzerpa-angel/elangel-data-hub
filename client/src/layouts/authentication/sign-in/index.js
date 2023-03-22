

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

import AuthApi from "../../../api/auth";

import { useAuth } from "context/auth.context";
import GoogleSocial from "../components/Socials/google";
import { CardMedia, Switch } from "@mui/material";

import linearGradient from "assets/theme/functions/linearGradient";

function SignIn() {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(JSON.parse(window.localStorage.getItem('rememberSession')));
  const [formData, setFormData] = useState({
    'email': '',
    'password': ''
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user, setUser } = useAuth();

  const handleSetRememberMe = () => {
    window.localStorage.setItem('rememberSession', !rememberMe);
    setRememberMe(!rememberMe)
  };

  const handleFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitFormData = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await AuthApi.loginWithEmailAndPassword({ ...formData, session: rememberMe })
      if (data.status >= 400) return setError(data.message);
      setUser(data);
      return navigate('/dashboard');
    } catch (err) {
      if (error.response) return setError(error.response.data.message);
      return setError("There has been an error.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) navigate('/');
  }, [navigate, user])

  return (
    <BasicLayout
      title={
        <>
          Bienvenido a {" "}
          <SoftTypography
            component="span"
            variant="inherit"
            sx={({ palette: { gradients } }) => ({
              background: linearGradient(gradients.info.state, 'white', 0),
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
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
            height: '10rem',
            objectFit: 'contain',
            m: 0,
            mb: 2,
          }}
          image={logo}
        />
        <SoftBox display="flex" flexDirection="column" alignItems="center" mb={2}>
          <GoogleSocial />
        </SoftBox>
        <Separator text="o" />
        <SoftBox component="form" role="form">
          <SoftBox mb={2}>
            <SoftBox mb={1} ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Email
              </SoftTypography>
            </SoftBox>
            <SoftInput type="email" name="email" value={formData?.email} onChange={handleFormData} placeholder="Email" />
          </SoftBox>
          <SoftBox mb={2}>
            <SoftBox mb={1} ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Contraseña
              </SoftTypography>
            </SoftBox>
            <SoftInput
              type="password"
              name="password"
              onChange={handleFormData}
              placeholder="Contraseña"
              value={formData?.password}
            />
          </SoftBox>
          <SoftBox display="flex" alignItems="center">
            <Switch checked={rememberMe} onChange={handleSetRememberMe} />
            <SoftTypography
              variant="button"
              fontWeight="regular"
              onClick={handleSetRememberMe}
              sx={{ cursor: "pointer", userSelect: "none" }}
            >
              &nbsp;&nbsp;Recuerdame
            </SoftTypography>
          </SoftBox>
          <SoftBox mt={2} mb={2} textAlign="center">
            <h6
              style={{
                fontSize: ".8em",
                color: "red",
                textAlign: "center",
                fontWeight: 400,
                transition: ".2s all",
              }}
            >
              {error}
            </h6>
          </SoftBox>
          <SoftBox mt={4} mb={1}>
            <SoftButton loading={isLoading} type="submit" variant="gradient" color="info" onClick={submitFormData} fullWidth>
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
