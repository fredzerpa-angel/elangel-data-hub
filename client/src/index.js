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
import { AuthProvider } from "./context/auth.context";

// Soft UI Dashboard React Context Provider
import { SoftUIControllerProvider } from "context";

let user = localStorage.getItem("user");
user = JSON.parse(user);

createRoot(document.getElementById("root"))
  .render(
    <BrowserRouter>
      <SoftUIControllerProvider>
        <AuthProvider userData={user}>
          <App />
        </AuthProvider>
      </SoftUIControllerProvider>
    </BrowserRouter>
  );
