// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import { Card, Divider } from "@mui/material";
import { Add, Delete, Edit, Security } from "@mui/icons-material";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";
import SoftButton from "components/SoftButton";
import SettingsMenu from "components/Menu/SettingsMenu/SettingsMenu";

// Libraries
import SimpleBar from "simplebar-react";
import 'simplebar-react/dist/simplebar.min.css';

function UsersList({ title, users }) {
  const renderUsers = users.map(({ image, fullname, role }, i) => {
    const isAdmin = role === 'admin';
    return (
      <SoftBox key={i} component="li" display="flex" alignItems="center" py={1} mb={1}>
        <SoftBox mr={2}>
          <SoftAvatar src={image} alt={fullname} variant="rounded" shadow="md" />
        </SoftBox>
        <SoftBox
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
        >
          <SoftTypography variant="button" fontWeight="medium" fontSize="medium">
            {fullname}
          </SoftTypography>
          <SoftTypography variant="caption" color="text" textTransform="uppercase">
            {role}
          </SoftTypography>
        </SoftBox>
        <SoftBox ml="auto">
          <SettingsMenu
            items={[
              { label: 'Editar', icon: <Edit fontSize="small" />, action: null, },
              { label: `${isAdmin ? 'Quitar' : 'Ser'} admin`, color: "info", icon: <Security color="info" fontSize="small" />, action: null, },
              { label: 'Eliminar', color: "error", icon: <Delete color="error" fontSize="small" />, action: null, },
            ]}
          />
        </SoftBox>
      </SoftBox>
    )
  });

  return (
    <Card sx={{ p: 2 }}>
      <SimpleBar style={{ maxHeight: '34rem' }}>
        <SoftBox>
          <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
            {title}
          </SoftTypography>
        </SoftBox>
        <SoftBox p={2}>
          <SoftBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
            <SoftBox>
              <SoftButton variant="gradient" color="dark">
                <Add sx={{ mr: 1 }} />
                Usuario
              </SoftButton>
            </SoftBox>
            <Divider />
            {renderUsers}
          </SoftBox>
        </SoftBox>
      </SimpleBar>
    </Card>
  );
}

// Typechecking props for the UsersList
UsersList.propTypes = {
  title: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default UsersList;
