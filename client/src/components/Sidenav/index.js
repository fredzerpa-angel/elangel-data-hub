// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import SidenavCollapse from "components/Sidenav/SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "components/Sidenav/SidenavRoot";
import sidenavLogoLabel from "components/Sidenav/styles/sidenav";

// Soft UI Dashboard React context
import { useSoftUIController, setOpenMobileSidenav } from "context";
import Overlay from "./Overlay";

function Sidenav({ color, brandLogo, brandName, routes, ...rest }) {
  const [controller, dispatch] = useSoftUIController();
  const { openMobileSidenav, transparentSidenav } = controller;
  const location = useLocation();
  const { pathname } = location;
  const collapseName = pathname.split("/").slice(1)[0];

  const closeSidenav = () => setOpenMobileSidenav(dispatch, false);


  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map(({ type, name, icon, title, noCollapse, key, route, href }) => {
    let returnValue;

    if (type === "collapse") {
      returnValue = href ? (
        <Link
          href={href}
          key={key}
          target="_blank"
          rel="noreferrer"
          sx={{ textDecoration: "none" }}
        >
          <SidenavCollapse
            color={color}
            name={name}
            icon={icon}
            active={key === collapseName}
            noCollapse={noCollapse}
          />
        </Link>
      ) : (
        <NavLink to={route} key={key}>
          <SidenavCollapse
            color={color}
            key={key}
            name={name}
            icon={icon}
            active={key === collapseName}
            noCollapse={noCollapse}
          />
        </NavLink>
      );
    } else if (type === "title") {
      returnValue = (
        <SoftTypography
          key={key}
          display="block"
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          opacity={0.6}
          pl={3}
          mt={2}
          mb={1}
          ml={1}
        >
          {title}
        </SoftTypography>
      );
    } else if (type === "divider") {
      returnValue = <Divider key={key} />;
    }

    return returnValue;
  });

  return (
    <>
      <SidenavRoot {...rest} variant="permanent" ownerState={{ transparentSidenav, openMobileSidenav }}>
        <SoftBox pt={3} px={4} textAlign="center">
          <SoftBox
            display={{ xs: "block", xl: "none" }}
            position="absolute"
            top={5}
            right={5}
            p={1.625}
            onClick={closeSidenav}
            sx={{ cursor: "pointer" }}
          >
            <SoftTypography variant="h6" color="secondary">
              <Icon sx={{ fontWeight: "bold" }}>close</Icon>
            </SoftTypography>
          </SoftBox>
          <SoftBox component={NavLink} to="/" display="flex" alignItems="center" justifyContent="center">
            {brandLogo && <SoftBox component="img" src={brandLogo} alt="El Angel Logo" width="2.5rem" />}
            <SoftBox
              sx={(theme) => sidenavLogoLabel(theme, { openMobileSidenav })}
            >
              <SoftTypography textAlign="start" component="h6" variant="button" fontSize="1rem" fontWeight="medium">
                {brandName}
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </SoftBox>
        <Divider />
        <List>{renderRoutes}</List>
      </SidenavRoot>
      <Overlay onClick={closeSidenav} ownerState={{ openMobileSidenav }} />
    </>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
