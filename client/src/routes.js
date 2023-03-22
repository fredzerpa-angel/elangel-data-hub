

/** 
  All of the routes for the Soft UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Soft UI Dashboard React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import Events from "layouts/events";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignOut from "layouts/authentication/sign-out";

// Soft UI Dashboard React icons
import Office from "examples/Icons/Office";
import { Assessment, Payments, Person, Today } from "@mui/icons-material";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <Assessment />,
    component: <Dashboard />,
    noCollapse: true,
    protected: true,
  },
  {
    type: "route",
    name: "Tables",
    key: "tables",
    route: "/tables",
    icon: <Office />,
    component: <Tables />,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Pagos & Deudas",
    key: "billing",
    route: "/billing",
    icon: <Payments />,
    component: <Billing />,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Eventos",
    key: "events",
    route: "/events",
    icon: <Today />,
    component: <Events />,
    noCollapse: true,
    protected: true,
  },
  { type: "title", title: "Configuracion", key: "account-pages" },
  {
    type: "collapse",
    name: "Perfil",
    key: "profile",
    route: "/profile",
    icon: <Person />,
    component: <Profile />,
    noCollapse: true,
    protected: true,
  },
  {
    type: "route",
    name: "Sign In",
    key: "sign-in",
    route: "/auth/sign-in",
    component: <SignIn />,
    noCollapse: true,
  },
  {
    type: "route",
    name: "Sign Out",
    key: "sign-out",
    route: "/auth/sign-out",
    component: <SignOut />,
    noCollapse: true,
  }
];

export default routes;
