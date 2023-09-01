import { useState } from "react";
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";

// Soft UI Dashboard React examples
import DashboardNavbar from "components/Navbars/DashboardNavbar";

// Images
import curved0 from "assets/images/backgrounds/curved0.jpg";

import { Controller, useForm } from "react-hook-form";
import { AddPhotoAlternate } from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import { serialize as formatObjToFormData } from "object-to-formdata";
import { CircularProgress } from "@mui/material";


const Header = ({ user = {}, onImageChange = async file => null }) => {
  const { setValue, control, handleSubmit } = useForm({
    defaultValues: {
      imageUrl: user.imageUrl
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async data => {
    try {
      setIsLoading(true);
      const formData = formatObjToFormData(data); // Needed to send image to the server
      const response = await onImageChange(formData);
      if (response?.error || !response) throw new Error(response?.message || "No se pudo cambiar su imagen de perfil");
      setValue("imageUrl", response.imageUrl);
      enqueueSnackbar("Se ha cambiado su imagen de perfil", { variant: "success" });
    } catch (err) {
      console.log(err)
      enqueueSnackbar(err.message || "No se pudo cambiar su imagen de perfil", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  const submitForm = async e => await handleSubmit(onSubmit)(e);

  const isSupervisor = user.privileges.users.upsert || user.privileges.users.delete;
  const userType = user.isAdmin ? "administrador" : isSupervisor ? "supervisor" : "usuario";
  return (
    <SoftBox position="relative">
      <DashboardNavbar absolute light />
      <SoftBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${curved0})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        component="form"
        role="form"
        encType="multipart/form-data"
        sx={{
          backdropFilter: `saturate(200%) blur(30px)`,
          backgroundColor: ({ functions: { rgba }, palette: { white } }) => rgba(white.main, 0.8),
          boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Controller
              control={control}
              name="imageUrl"
              render={({ field: { onChange, value } }) => (
                <SoftButton loading={isLoading} component="label" variant="text" sx={{ p: 0 }}>
                  <SoftAvatar
                    size="xxl"
                    variant="rounded"
                    shadow="md"
                    bgColor={value && (typeof value === "string") ? "transparent" : "dark"}
                    src={typeof value === "string" ? value : ""}
                    sx={{
                      svg: { // overwrites icon styles
                        fontSize: "3.5rem !important"
                      }
                    }}
                  >
                    {
                      isLoading ? <CircularProgress color="white" /> : <AddPhotoAlternate />
                    }
                  </SoftAvatar>
                  <input
                    hidden
                    accept="image/,.jpg,.jpeg,.png,.gif,.webp"
                    type="file"
                    onChange={async e => {
                      // On cancel nothing happens
                      if (e.target.files.length) {
                        await setValue("imageUrl", e.target.files[0])
                        return await submitForm(e);
                      }
                    }}
                  />
                  <SoftBox
                    sx={{
                      display: !(typeof value === "string" && value) && "none",
                      position: "absolute",
                      zIndex: 1300,
                      width: "100%",
                      bottom: 0,
                    }}
                  >
                    <SoftButton
                      color="white"
                      variant="text"
                      onClick={async e => {
                        await setValue("imageUrl", null)
                        return await submitForm(e);
                      }}
                      p={0}
                      sx={{
                        fontSize: "0.65rem",
                        width: "100%",
                        borderRadiusBottom: 0,
                        "&, :hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                        }
                      }}
                    >
                      Quitar Imagen
                    </SoftButton>
                  </SoftBox>
                </SoftButton>
              )}
            />
          </Grid>
          <Grid item>
            <SoftBox height="100%" mt={0.5} lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                {user.fullname}
              </SoftTypography>
              <SoftTypography variant="button" color="text" fontWeight="medium" textTransform="uppercase">
                {userType}
              </SoftTypography>
            </SoftBox>
          </Grid>
        </Grid>
      </Card>
    </SoftBox>
  );
}

export default Header;
