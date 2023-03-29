// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import { Card, Tooltip } from "@mui/material";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

import { defaultsDeep } from 'lodash';
import SoftButton from "components/SoftButton";
import { Edit } from "@mui/icons-material";
import { useState } from "react";
import SoftInput from "components/SoftInput";
import { useForm } from "react-hook-form";
import { formatUserInfoToModalSchema, formatUserInfoToMongoSchema } from "./ProfileInfoCard.utils";
import useUsers from "hooks/users.hooks";
import { enqueueSnackbar } from "notistack";

const DEFAULT_VALUES = {
  email: {
    label: "email",
    value: "",
  },
  fullname: {
    label: "Nombre Completo",
    value: "",
  },
  phone: {
    label: "Telefono",
    value: "",
  },
}

const ProfileInfoCard = ({ title, info }) => {
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, getValues } = useForm({
    defaultValues: defaultsDeep(formatUserInfoToModalSchema(info), DEFAULT_VALUES)
  });
  const { updateUserByEmail } = useUsers();

  const openEditMode = () => setEditMode(true);
  const closeEditMode = () => setEditMode(false);

  const onSubmit = async (data) => {
    delete data.email;
    const formattedData = formatUserInfoToMongoSchema(data)
    formattedData.phones = { main: formattedData.phone };
    try {
      const response = await updateUserByEmail(info.email, formattedData);
      if (!response.ok) throw new Error(response.message);
      return enqueueSnackbar("Se actualizo su perfil exitosamente", {variant: "success"});
    } catch (err) {
      return enqueueSnackbar(err.message, {variant: "error"});
    } finally {
      closeEditMode();
    }
  }

  // Render the card info items
  const renderItems = Object.entries(info).map(([key, value], i) => {
    const isEditable = !['nivel', 'email'].includes(key);
    return (
      <SoftBox key={i} display="flex" flexDirection="column" py={1}>
        <SoftTypography variant="button" width="100%" fontWeight="bold" textTransform="capitalize" >
          {
            // Convert this form `objectKey` of the object key in to this `object key`
            `${getValues(key).label}: \u00A0`
          }
        </SoftTypography>
        <SoftBox display="flex">
          <SoftInput
            {...register(`${key}.value`)}
            size="small"
            readOnly={!(isEditable && editMode)}
            sx={
              !(isEditable && editMode) &&
              {
                '&, &:focus, &.Mui-focused': { border: 'none', boxShadow: 'none' }
              }
            }
          />
        </SoftBox>
      </SoftBox>
    )
  });


  return (
    <Card sx={{ p: 2 }}>
      <SoftBox display="flex" justifyContent="space-between">
        <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </SoftTypography>

        {
          !editMode && (
            <Tooltip title="Editar" placement="top">
              <SoftButton
                iconOnly
                variant="text"
                color="secondary"
                circular
                onClick={openEditMode}
              >
                <Edit />
              </SoftButton>
            </Tooltip>
          )
        }
      </SoftBox>
      <SoftTypography variant="button" fontWeight="regular" color="text" paragraph>
        Para cambiar su nivel o email, por favor comuniquese con administracion
      </SoftTypography>
      <SoftBox px={1} py={1} component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
        <SoftBox>
          {renderItems}
        </SoftBox>
        {
          editMode && (
            <SoftBox display="flex" alignItems="center" justifyContent="flex-end" gap={3} p={2}>
              <SoftButton size="small" onClick={closeEditMode}>
                Cancelar
              </SoftButton>
              <SoftButton size="small" variant="gradient" color="dark" type="submit">
                Guardar
              </SoftButton>
            </SoftBox>
          )
        }
      </SoftBox>
    </Card>
  );
}

// Typechecking props for the ProfileInfoCard
ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.objectOf(PropTypes.string).isRequired
};

export default ProfileInfoCard;
