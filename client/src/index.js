/**
=========================================================
* Soft UI Dashboard React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from "App";

// Soft UI Dashboard React Context Provider
import { AuthProvider } from "./context/auth.context";
import { SoftUIControllerProvider } from "context";
import { SnackbarProvider } from 'notistack'

createRoot(document.getElementById("root"))
  .render(
    <BrowserRouter>
      <SoftUIControllerProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          disableWindowBlurListener={true}
        >
          <AuthProvider userData={null}>
            <App />
          </AuthProvider>
        </SnackbarProvider>
      </SoftUIControllerProvider>
    </BrowserRouter >
  );
