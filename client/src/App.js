

import { useEffect } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Soft UI Dashboard React examples
import Sidenav from "components/Sidenav";

// Soft UI Dashboard React themes
import theme from "assets/theme";

// Soft UI Dashboard React routes
import routes from "./routes";
import { ProtectedRoute } from "./ProtectedRoute";

// Soft UI Dashboard React contexts
import { useSoftUIController } from "context";

// Images
import brandLogo from "assets/images/el-angel/logo-small.png";

import { useAuth } from "context/auth.context";
import { MountPoint } from "context/confirmation.context";

// react-chartjs-2 components
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables); // Fix react-chartjs-2 migration from v3 to v5

function App() {
  const [controller] = useSoftUIController();
  const { user } = useAuth();
  const { layout, sidenavColor } = controller;
  const { pathname } = useLocation();

  // Change the openConfigurator state

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        if (route.protected) {
          return (
            <Route key={route.key} element={<ProtectedRoute />}>
              <Route path={route.route} element={route.component} />
            </Route>
          );
        }
        return <Route path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MountPoint /> {/* Confirmation Context Provider */}
      {layout === "dashboard" && user && (
        <>
          <Sidenav
            color={sidenavColor}
            brandLogo={brandLogo}
            brandName="U.E. El Angel"
            routes={routes}
          />
        </>
      )}
      <Routes>
        {getRoutes(routes)}
        <Route path="*" element={<Navigate to="/billing" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;