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
import UserModal from "components/Modals/UserModal";

// Libraries
import SimpleBar from "simplebar-react";
import 'simplebar-react/dist/simplebar.min.css';
import { useState } from "react";
import useUsers from "hooks/users.hooks";
import { useAuth } from "context/auth.context";
import { enqueueSnackbar } from "notistack";

function UsersList({ title, users }) {
  const { user: userSession } = useAuth();
  const [open, setOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const { createUser, updateUserByEmail, deleteUserByEmail } = useUsers();

  const openModal = () => setOpen(true);
  const closeModal = () => {
    setOpen(false);
    if (userToEdit) setUserToEdit(null);
  }

  const editUser = (email) => async (userUpdated) => {
    return await updateUserByEmail(email, userUpdated);
  }

  const renderUsers = users.map((user, i) => {
    const isAdmin = Object.values(user.privileges).flatMap(access => Object.values(access)).every(Boolean);

    const getSettingsMenuItems = () => {
      const items = [];
      if (userSession.privileges.users.upsert) {
        const editUser = (user) => {
          setUserToEdit(user)
          openModal();
        }
        const toggleUserAdminPrivileges = async (user) => {

          const newPrivileges = {
            reports: {
              read: true, // Default Privileges
            },
            users: {
              read: true, // Default Privileges
              upsert: !isAdmin,
              delete: !isAdmin,
            },
            events: {
              read: true, // Default Privileges
              upsert: !isAdmin,
              delete: !isAdmin,
            },
          };
          try {
            const response = await updateUserByEmail(user.email, { privileges: newPrivileges });
            if (!response?.ok) throw new Error(response.message)
            return enqueueSnackbar("Se ha cambiado los privilegios exitosamente", { variant: "success" });
          } catch (err) {
            enqueueSnackbar(err.message, { variant: "error" });
          }
        }

        items.push(
          {
            label: 'Editar',
            icon: <Edit fontSize="small" />,
            action: () => editUser(user),
          },
          {
            label: `${isAdmin ? 'Quitar' : 'Ser'} admin`,
            color: "info",
            icon: <Security color="info" fontSize="small" />,
            action: () => toggleUserAdminPrivileges(user),
          },
        )
      }
      if (userSession.privileges.users.delete) {
        const deleteUser = async (email) => {
          try {
            const response = await deleteUserByEmail(email)
            if (!response?.ok) throw new Error(response.message)
            return enqueueSnackbar("Se ha borrado el usuario exitosamente", { variant: "success" });
          } catch (err) {
            enqueueSnackbar(err.message, { variant: "error" });
          }
        }
        items.push({
          label: 'Eliminar',
          color: "error",
          icon: <Delete color="error" fontSize="small" />,
          action: () => deleteUser(user.email),
        })
      }

      return items;
    }

    return (
      <SoftBox key={i} component="li" display="flex" alignItems="center" py={1} mb={1}>
        <SoftBox mr={2}>
          <SoftAvatar src={user.imageUrl} alt={user.fullname} variant="rounded" bgColor="dark" shadow="md" />
        </SoftBox>
        <SoftBox
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
        >
          <SoftTypography variant="button" fontWeight="medium" fontSize="medium">
            {user.fullname}
          </SoftTypography>
          <SoftTypography variant="caption" color="text" textTransform="uppercase">
            {isAdmin ? "administrador" : "usuario"}
          </SoftTypography>
        </SoftBox>
        {
          userSession.privileges.users.upsert || userSession.privileges.users.delete ?
            (
              <SoftBox ml="auto">
                <SettingsMenu
                  items={getSettingsMenuItems()}
                />
              </SoftBox>
            ) : null
        }
      </SoftBox>
    )
  });

  return (
    <>
      <Card sx={{ p: 2 }}>
        <SimpleBar style={{ maxHeight: '34rem' }}>
          <SoftBox>
            <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
              {title}
            </SoftTypography>
          </SoftBox>
          <SoftBox p={2}>
            <SoftBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
              {
                userSession.privileges.users.upsert ?
                  (
                    <>
                      <SoftBox>
                        <SoftButton variant="gradient" color="dark" onClick={openModal}>
                          <Add sx={{ mr: 1 }} />
                          Usuario
                        </SoftButton>
                      </SoftBox>
                      <Divider />
                    </>
                  )
                  : null
              }
              {renderUsers}
            </SoftBox>
          </SoftBox>
        </SimpleBar>
      </Card>
      {open &&
        <UserModal
          title={userToEdit ? "Editar Usuario" : "Nuevo Usuario"}
          user={userToEdit ?? {}}
          open={open}
          close={closeModal}
          onSubmit={userToEdit ? editUser(userToEdit.email) : createUser}
        />
      }
    </>
  );
}

// Typechecking props for the UsersList
UsersList.propTypes = {
  title: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default UsersList;
