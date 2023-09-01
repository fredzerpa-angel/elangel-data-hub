

// @mui material components
import Grid from "@mui/material/Grid";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";

// Soft UI Dashboard React examples
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import Footer from "components/Footer/Dashboard";
import ProfileInfoCard from "components/Cards/InfoCards/ProfileInfoCard";

// Overview page components
import Header from "components/Header";
import PlatformSettings from "components/PlatformSettings";
import ChangePassword from "../../components/ChangePassword";
import UsersList from "../../components/UsersList";

import { useAuth } from "context/auth.context";
import useUsers from "hooks/users.hooks";

const ProfileOverview = () => {
  const { user: userSession } = useAuth();
  const { users, createUser, updateUserByEmail, updateSelfData, changePassword, deleteUserByEmail } = useUsers();


  const handleProfileChange = async data => await updateSelfData(data);
  const handlePasswordChange = async (oldPassword, newPassword) => await changePassword(oldPassword, newPassword);

  const handleCreateUser = async data => await createUser(data);
  const handleUpdateUser = async (user, updatedData) => await updateUserByEmail(user.email, updatedData);
  const handleDeleteUser = async user => await deleteUserByEmail(user.email);

  return (
    <DashboardLayout>
      <Header user={userSession} onImageChange={handleProfileChange} />
      <SoftBox mt={5} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <PlatformSettings settings={userSession.notifications} onChange={handleProfileChange} />
          </Grid>
          <Grid item container xs={12} md={4} spacing={3}>
            <Grid item xs={12} md={12}>
              <ProfileInfoCard
                title="Informacion de Perfil"
                info={{
                  email: userSession.email,
                  fullname: {
                    names: userSession?.names,
                    lastnames: userSession?.lastnames,
                  },
                  phone: userSession?.phones?.main || "N/A",
                }}
                onChange={handleProfileChange}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <ChangePassword onChange={handlePasswordChange} />
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <UsersList
              title="Usuarios"
              users={users}
              createUser={handleCreateUser}
              updateUser={handleUpdateUser}
              deleteUser={handleDeleteUser}
            />
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ProfileOverview;
