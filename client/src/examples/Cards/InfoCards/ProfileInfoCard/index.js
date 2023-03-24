// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import { Card, Tooltip } from "@mui/material";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

import { startCase } from 'lodash';
import SoftButton from "components/SoftButton";
import { Edit } from "@mui/icons-material";
import { useState } from "react";
import SoftInput from "components/SoftInput";

const ProfileInfoCard = ({ title, info, action }) => {
  const [editMode, setEditMode] = useState(false);

  const openEditMode = () => setEditMode(true);
  const closeEditMode = () => setEditMode(false);

  const submitForm = () => {

  }

  // Render the card info items
  const renderItems = Object.entries(info).map(([key, value], i) => {
    const isEditable = !['nivel', 'email'].includes(key);

    return (
      <SoftBox key={i} display="flex" flexDirection="column" py={1} pr={2} >
        <SoftTypography variant="button" width="100%" fontWeight="bold" textTransform="capitalize" >
          {
            // Convert this form `objectKey` of the object key in to this `object key`
            `${startCase(key)}: \u00A0`
          }
        </SoftTypography>

        <SoftInput
          name={key}
          size="small"
          width="100%"
          defaultValue={value}
          readOnly={!(isEditable && editMode)}
          sx={
            !(isEditable && editMode) &&
            {
              '&, &:focus, &.Mui-focused': { border: 'none', boxShadow: 'none' }
            }
          }
        />
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
            <Tooltip title={action.tooltip} placement="top">
              <SoftButton
                iconOnly
                variant="text"
                color="text"
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
      <SoftBox px={1} py={1} component="form" role="form">
        <SoftBox>
          {renderItems}
        </SoftBox>
        {
          editMode && (
            <SoftBox display="flex" alignItems="center" justifyContent="flex-end" gap={3} p={2}>
              <SoftButton size="small" onClick={closeEditMode}>
                Cancelar
              </SoftButton>
              <SoftButton size="small" color="dark" onClick={submitForm}>
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
  info: PropTypes.objectOf(PropTypes.string).isRequired,
  action: PropTypes.shape({
    route: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProfileInfoCard;
