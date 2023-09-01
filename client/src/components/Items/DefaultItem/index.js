

import { forwardRef } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// custom styles for the DefaultItem
import { menuItem, menuIcon } from "components/Items/DefaultItem/styles";

const DefaultItem = forwardRef(({ color, icon, title, description, ...rest }, ref) => (
  <SoftBox {...rest} ref={ref} sx={(theme) => menuItem(theme)}>
    <SoftBox
      width="3rem"
      height="3rem"
      sx={(theme) => menuIcon(theme, { color })}
    >
      <Icon fontSize="medium" >
        {icon}
      </Icon>
    </SoftBox>

    <SoftBox ml={2} width="100%" sx={{ overflow: 'hidden' }}>
      <SoftTypography variant="button" component="h6" fontWeight="medium" sx={{ width: '100%', }} noWrap>
        {title}
      </SoftTypography>
      <SoftTypography variant="button" component="p" color="secondary" fontWeight="regular">
        {description}
      </SoftTypography>
    </SoftBox>
  </SoftBox>
));

// Setting default values for the props of DefaultItem
DefaultItem.defaultProps = {
  color: "dark",
};

// Typechecking props for the DefaultItem
DefaultItem.propTypes = {
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
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default DefaultItem;
