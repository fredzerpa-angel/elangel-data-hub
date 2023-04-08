// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { Controller, useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";

function PlatformSettings({ settings, onChange }) {
  const { control, handleSubmit } = useForm({
    defaultValues: settings
  });

  const onSubmit = async (settings) => {
    try {
      const response = await onChange({ notifications: settings });
      if (response?.error || !response) throw new Error(response?.message || "Error en el cambio de configuraciones")
      return enqueueSnackbar("Se han cambiado tus configuraciones exitosamente", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  }

  return (
    <Card sx={{ p: 2 }} component="form" role="form" onChange={handleSubmit(onSubmit)}>
      <SoftBox>
        <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Configuraciones
        </SoftTypography>
      </SoftBox>
      <SoftBox pt={1.5} pb={2} px={2} lineHeight={1.25}>
        <SoftTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Cuenta
        </SoftTypography>
        <SoftBox display="flex" alignItems="center" py={1} mb={0.25}>
          <SoftBox mt={0.25}>
            <Controller
              control={control}
              name="students.assistance"
              render={({ field: { value, ...rest } }) => (
                <Switch checked={value} {...rest} />
              )}
            />
          </SoftBox>
          <SoftBox width="80%" ml={2}>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Notificarme las asistencias academicas
            </SoftTypography>
          </SoftBox>
        </SoftBox>
        <SoftBox display="flex" alignItems="center" py={1} mb={0.25}>
          <SoftBox mt={0.25}>
            <Controller
              control={control}
              name="events.onGoing"
              render={({ field: { value, ...rest } }) => (
                <Switch checked={value} {...rest} />
              )}
            />
          </SoftBox>
          <SoftBox width="80%" ml={2}>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Notificarme los eventos "En Curso"
            </SoftTypography>
          </SoftBox>
        </SoftBox>
        <SoftBox display="flex" alignItems="center" py={1} mb={0.25}>
          <SoftBox mt={0.25}>
            <Controller
              control={control}
              name="debts.onWatch"
              render={({ field: { value, ...rest } }) => (
                <Switch checked={value} {...rest} />
              )}
            />
          </SoftBox>
          <SoftBox width="80%" ml={2}>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Notificarme las alertas de deudas
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

export default PlatformSettings;
