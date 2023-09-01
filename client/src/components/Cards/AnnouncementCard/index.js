import { Card } from "@mui/material";
import SoftAvatar from "components/SoftAvatar";
import SoftBadge from "components/SoftBadge";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import PropTypes from "prop-types";


const AnnouncementCard = ({ by, badge, title, description, value, action, ...rest }) => {
  return (
    <Card
      {...rest}
      sx={{
        width: "100%",
        p: 2,
        ...rest.sx
      }}
    >
      <SoftBox display="flex" justifyContent="space-between" mb={3}>
        <SoftBox display="flex">
          <SoftAvatar src={by?.imageUrl} alt="User" size="sm" bgColor="dark" variant="rounded" />
          <SoftBox display="flex" flexDirection="column" ml={1}>
            <SoftTypography
              variant="button"
              textTransform="capitalize"

            >
              {by?.fullname}
            </SoftTypography>
            <SoftTypography
              variant="caption"
              color="secondary"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {by?.date}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
        <SoftBox>
          <SoftBadge color={badge?.color} badgeContent={badge?.label} container />
        </SoftBox>
      </SoftBox>

      <SoftBox mb={2}>
        <SoftTypography variant="h5" fontSize="medium" paragraph>
          {title}
        </SoftTypography>
        <SoftTypography variant="body2" color="text" fontSize="small">
          {description}
        </SoftTypography>
      </SoftBox>

      <SoftBox
        bgColor="grey-100"
        borderRadius="lg"
        width="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
      >
        <SoftBox display="flex" alignItems="flex-end">
          {value?.type && <SoftTypography variant="button" color="text" fontWeight="medium" mr={0.5}>{value.type}</SoftTypography>}
          {value?.amount && <SoftTypography variant="h4" color="dark">{value.amount}</SoftTypography>}
          {value?.method && <SoftTypography variant="button" color="text" fontWeight="medium" ml={0.5}>/ {value.method}</SoftTypography>}
        </SoftBox>

        { // En caso de incluir la accion no se agregara el boton
          !!action &&
          (
            <SoftButton
              variant="gradient"
              color="error"
              onClick={action?.onClick}
            >
              {action.label}
            </SoftButton>
          )
        }

      </SoftBox>
    </Card>
  )
}

AnnouncementCard.propTypes = {
  by: PropTypes.shape({ imageUrl: PropTypes.string, fullname: PropTypes.string, date: PropTypes.string }).isRequired,
  badge: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "light",
      "dark",
    ]),
    label: PropTypes.string
  }).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  value: PropTypes.shape({
    type: PropTypes.string,
    amount: PropTypes.string,
    method: PropTypes.string
  }),
  action: PropTypes.shape({
    label: PropTypes.string,
    onClick: PropTypes.func,
  })
}

export default AnnouncementCard;