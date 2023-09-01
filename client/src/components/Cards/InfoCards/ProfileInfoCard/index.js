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
import { serializeUserInfoToSchema, deserializeUserInfo } from "./ProfileInfoCard.utils";
import { enqueueSnackbar } from "notistack";

const DEFAULT_VALUES = {
  email: {
    label: "Email",
    value: "",
    isEditable: false,
  },
  fullname: {
    label: "Nombre Completo",
    value: {
      names: {
        label: "Nombres",
        value: "",
      },
      lastnames: {
        label: "Apellidos",
        value: ""
      },
    },
    isEditable: true,
  },
  phone: {
    label: "Telefono",
    value: "",
    isEditable: true,
  },
}

const ProfileInfoCard = ({ title, info, onChange }) => {
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, getValues, reset } = useForm({
    defaultValues: defaultsDeep(serializeUserInfoToSchema(info), DEFAULT_VALUES)
  });

  const openEditMode = () => setEditMode(true);
  const closeEditMode = () => setEditMode(false);

  const onSubmit = async (data) => {
    try {
      // Remove non editable properties
      Object.entries(data).forEach(([key, { isEditable }]) => {
        if (!isEditable) delete data[key];
      });

      const formattedData = deserializeUserInfo(data)

      // Set data structure as mongo schema
      formattedData.phones = { main: formattedData.phone };
      formattedData.names = formattedData.fullname.names;
      formattedData.lastnames = formattedData.fullname.lastnames;
      formattedData.fullname = `${formattedData.names} ${formattedData.lastnames}`;
      delete formattedData.phone; // remove duplicate

      const response = await onChange(formattedData);
      if (response?.error) throw new Error(response.message);
      enqueueSnackbar("Se ha actualizado su perfil", { variant: "success" });
      closeEditMode();
    } catch (err) {
      reset(null, { keepDefaultValues: true });
      return enqueueSnackbar(err.message, { variant: "error" });
    }
  }

  const onCancel = () => {
    reset(null, { keepDefaultValues: true })
    closeEditMode();
  }

  // Render the card info items
  const renderItems = Object.entries(info).map(([key, value], i) => {
    const isEditable = getValues(key)?.isEditable;

    // Nested Objects in value
    if (typeof value === "object") {
      return (
        <SoftBox key={i} display="flex" flexDirection="column" py={1}>
          <SoftTypography variant="button" width="100%" fontWeight="bold" textTransform="capitalize" >
            {
              // Convert this form `objectKey` of the object key in to this `object key`
              getValues(key).label
            }
          </SoftTypography>
          <SoftBox display="flex" justifyContent="space-between" gap={1}>
            {
              editMode ?
                (
                  Object.entries(value).map(([childKey, childValue]) => {
                    return (
                      <SoftInput
                        key={childKey}
                        {...register(`${key}.value.${childKey}.value`)}
                        size="small"
                        placeholder={getValues(key).value[childKey].label}
                        readOnly={!(isEditable)}
                        sx={
                          !(isEditable) &&
                          {
                            '&, &:focus, &.Mui-focused': { border: 'none', boxShadow: 'none' }
                          }
                        }
                      />
                    )
                  })
                )
                :
                (
                  <SoftTypography
                    fontWeight="regular"
                    variant="button"
                    textTransform="capitalize"
                    width="100%"
                    sx={theme => ({
                      color: theme.palette.grey[700], // Same input color
                      padding: `${theme.functions.pxToRem(8)} ${theme.functions.pxToRem(12)}`, // Same input padding
                    })}
                  >
                    {Object.values(getValues(key).value).map(({ value }) => value).join(" ")}
                  </SoftTypography>
                )
            }
          </SoftBox>
        </SoftBox>
      )
    }

    // Simple values
    return (
      <SoftBox key={i} display="flex" flexDirection="column" py={1}>
        <SoftTypography variant="button" width="100%" fontWeight="bold" textTransform="capitalize" >
          {
            // Convert this form `objectKey` of the object key in to this `object key`
            getValues(key).label
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
              <SoftButton size="small" onClick={onCancel}>
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
  info: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ProfileInfoCard;
