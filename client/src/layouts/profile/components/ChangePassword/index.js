

import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import AuthApi from "api/auth";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

function ChangePassword() {
  const [formData, setFormData] = useState({
    password: '',
    repassword: ''
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      const { data } = await AuthApi.loginWithEmailAndPassword(formData)
      if (data.status >= 400) return setError(data.message);
    } catch (err) {
      if (error.response) return setError(error.response.data.message);
      return setError("There has been an error.");
    } finally {
      setIsLoading(false);
    }
  };

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
      <SoftBox component="form" role="form">
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Contraseña
            </SoftTypography>
          </SoftBox>
          <SoftInput
            type="password"
            name="password"
            value={formData?.password}
            onChange={handleFormData}
            placeholder="Contraseña Actual"
          />
        </SoftBox>
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Nueva contraseña
            </SoftTypography>
          </SoftBox>
          <SoftInput
            type="password"
            name="repassword"
            value={formData?.password}
            onChange={handleFormData}
            placeholder="Nueva Contraseña"
          />
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
            {!isLoading && "Cambiar contraseña"}
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

export default ChangePassword;
