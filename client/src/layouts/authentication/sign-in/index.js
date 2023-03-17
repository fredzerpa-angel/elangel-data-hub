

import { useState } from "react";
import { RotatingLines } from "react-loader-spinner";
// react-router-dom components
import { useNavigate } from "react-router-dom";

// @mui material components
import Switch from "@mui/material/Switch";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";
import GoogleSocial from "../components/Socials/google";
import Separator from "layouts/authentication/components/Separator";

// Images
import elAngelInstagramPhoto from "assets/images/el-angel/instagram/promo.jpg";
import logo from "assets/images/el-angel/logo.png";

import AuthApi from "../../../api/auth";
import { useAuth } from "../../../context/auth.context";

function SignIn() {
  const navigate = useNavigate();

  const [rememberMe, setRememberMe] = useState(true);
  const [formData, setFormData] = useState({
    'email': '',
    'password': ''
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useAuth();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const setProfile = (response) => {
    const { user, token } = response.data;
    user.token = token;
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    return navigate("/dashboard");
  };

  const submitFormData = (e) => {
    e.preventDefault();
    setIsLoading(true);

    AuthApi.loginWithEmailAndPassword({ ...formData, session: rememberMe })
      .then((response) => {
        if (response.data.success) {
          return setProfile(response);
        } else {
          setError(response.data.msg);
        }
      })
      .catch((error) => {
        if (error.response) {
          return setError(error.response.data.msg);
        }
        return setError("There has been an error.");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <CoverLayout
      title="Bienvenido de vuelta"
      description="Inicie sesion a traves de su cuenta de Google El Angel o con su cuenta de Email."
      logo={logo}
      image={elAngelInstagramPhoto}
      top={5}
    >
      {isLoading ? (
        <SoftBox display="flex" justifyContent="center">
          <RotatingLines
            strokeColor="black"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        </SoftBox>
      ) :
        <>
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
              <SoftButton variant="gradient" color="info" onClick={submitFormData} fullWidth>
                Iniciar sesion
              </SoftButton>
            </SoftBox>
            <SoftBox mt={3} textAlign="center">
              <SoftTypography variant="button" color="text" fontWeight="regular">
                Si no posees una cuenta, por favor comunicate con Administracion El Angel.
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </>
      }
    </CoverLayout>
  );
}

export default SignIn;
