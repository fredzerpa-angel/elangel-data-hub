

// @mui material components
import Grid from "@mui/material/Grid";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";
import ChangePassword from "./components/ChangePassword";
import UsersList from "./components/UsersList";

import { useAuth } from "context/auth.context";

// Data
import USERS_MOCK from "layouts/profile/data/usersListData";

const ProfileOverview = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <Header user={user} />
      <SoftBox mt={5} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <PlatformSettings user={user} />
          </Grid>
          <Grid item container xs={12} md={4} spacing={3}>
            <Grid item xs={12} md={12}>
              <ProfileInfoCard
                title="Informacion de Perfil"
                info={{
                  email: user.email,
                  fullname: user?.fullname,
                  phone: user?.phones?.main || "N/A",
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <ChangePassword />
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <UsersList title="Usuarios" users={USERS_MOCK.filter(({ email }) => email !== user.email)} />
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ProfileOverview;
