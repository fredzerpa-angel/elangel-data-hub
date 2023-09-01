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
import { useAuth } from "context/auth.context";
import { enqueueSnackbar } from "notistack";
import GetPasswordConsent from "components/GetPasswordConsent";

const UsersList = ({ users, createUser, updateUser, deleteUser }) => {
  const { user: userSession } = useAuth();
  const [userToEdit, setUserToEdit] = useState(null);

  const openModal = (user) => () => setUserToEdit(user);
  const closeModal = () => setUserToEdit(null);

  const editUser = (user) => async (updatedData) => {
    return await updateUser(user, updatedData);
  }

  const renderUsers = users?.filter(({ email }) => email !== userSession.email).map((user, i) => {
    const settingsMenuItems = [];
    const renderedUserIsSupervisor = user.privileges.users.upsert || user.privileges.users.delete;

    if (userSession.privileges.users.upsert) {
      if (!renderedUserIsSupervisor || userSession.isAdmin) {
        const onEdit = (user) => setUserToEdit(user);

        settingsMenuItems.push(
          {
            label: "Editar",
            icon: <Edit fontSize="small" />,
            action: () => onEdit(user),
          },
        )
      }
    }

    if (userSession.isAdmin) {
      const setAdminPrivileges = async (user) => {
        try {
          const allowedAction = await GetPasswordConsent({
            title: "Dar acceso administrativo",
            description: `Ingrese su clave para dar acceso administrativo a ${user.fullname}`,
            warning: "Esta accion es irreversible, en caso de equivocacion contactese con soporte"
          });

          if (allowedAction?.error || !allowedAction) throw new Error(allowedAction?.message || "Contraseña incorrecta");

          const adminPrivileges = {
            reports: {
              read: true, // Default Privilege
            },
            users: {
              read: true, // Default Privilege
              upsert: true,
              delete: true,
            },
            events: {
              read: true, // Default Privilege
              upsert: true,
              delete: true,
            },
          };
          const response = await updateUser(user, { isAdmin: true, privileges: adminPrivileges });
          if (response?.error || !response) throw new Error(response?.message || "Error al actualizar los privilegios de Administrador")
          return enqueueSnackbar("Se actualizaron los privilegios exitosamente", { variant: "success" });
        } catch (err) {
          return enqueueSnackbar(err.message, { variant: "error" });
        }
      }

      settingsMenuItems.push(
        {
          label: "Ser admin",
          color: "info",
          icon: <Security color="info" fontSize="small" />,
          action: () => setAdminPrivileges(user),
        },
      )
    }

    if (userSession.privileges.users.delete) {
      if (!renderedUserIsSupervisor || userSession.isAdmin) {

        const onDelete = async (user) => {
          try {
            const response = await deleteUser(user)
            if (response?.error || !response) throw new Error(response?.message || "Error al borrar usuario")
            return enqueueSnackbar("Se ha borrado el usuario exitosamente", { variant: "success" });
          } catch (err) {
            return enqueueSnackbar(err.message, { variant: "error" });
          }
        }

        settingsMenuItems.push({
          label: "Eliminar",
          color: "error",
          icon: <Delete color="error" fontSize="small" />,
          action: () => onDelete(user),
        })
      }
    }

    const userType = user.isAdmin ? "administrador" : renderedUserIsSupervisor ? "supervisor" : "usuario";
    return (
      <SoftBox key={i} component="li" display="flex" alignItems="center" py={1} mb={1}>
        <SoftBox mr={2}>
          <SoftAvatar alt={user.fullname} src={user.imageUrl || "/"} variant="rounded" bgColor="dark" shadow="md" />
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
            {userType}
          </SoftTypography>
        </SoftBox>
        {
          // Admin users can't be updated by other users and needs necessary privileges
          !user.isAdmin && (userSession.privileges.users.upsert || userSession.privileges.users.delete) && settingsMenuItems.length ?
            (
              <SoftBox ml="auto">
                <SettingsMenu
                  items={settingsMenuItems}
                />
              </SoftBox>
            ) : null
        }
      </SoftBox>
    )
  });

  return (
    <>
      <Card sx={{ p: 2, maxHeight: "35rem" }}>
        <SimpleBar style={{ maxHeight: '100%' }}>
          <SoftBox>
            <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
              Usuarios
            </SoftTypography>
          </SoftBox>
          <SoftBox p={2}>
            <SoftBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
              {
                userSession.privileges.users.upsert ?
                  (
                    <>
                      <SoftBox>
                        <SoftButton variant="gradient" color="dark" onClick={openModal({})}>
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
      {
        userToEdit &&
        <UserModal
          title={userToEdit ? "Editar Usuario" : "Nuevo Usuario"}
          user={userToEdit}
          open={Boolean(userToEdit)}
          close={closeModal}
          onSubmit={Object.keys(userToEdit).length ? editUser(userToEdit) : createUser}
        />
      }
    </>
  );
}

// Typechecking props for the UsersList
UsersList.propTypes = {
  title: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  createUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
};

export default UsersList;
