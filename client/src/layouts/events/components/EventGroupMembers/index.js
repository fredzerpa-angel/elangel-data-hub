import { Avatar, AvatarGroup, Divider, Tooltip } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import useUsers from "hooks/users.hooks";
import { enqueueSnackbar } from "notistack";
import EventsManagersButton from "./EventsManagersButton";

const EventGroupMembers = () => {
  const { users, updateUserByEmail } = useUsers();

  const eventsManagers = users.filter(({ privileges }) => privileges.events.upsert);
  const selectableManagers = users.filter(({ privileges }) => !privileges.events.upsert);

  const onAddManager = async (userSelected) => {
    try {
      const response = await updateUserByEmail(
        userSelected.email,
        {
          'privileges.events': { ...userSelected.privileges.events, upsert: true, delete: true }
        }
      );
      if (response?.error || !response) throw new Error(response?.message || "No se pudo agregar el administrador")
      return enqueueSnackbar("Se ha agregado un nuevo administrador de eventos", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  }

  return (
    <SoftBox display="flex">
      <SoftBox display="flex" flexDirection="column">
        <SoftTypography align="center" component="p" variant="caption" fontWeight="medium" mb={1} color="text">
          Administradores de Eventos:
        </SoftTypography>
        <AvatarGroup
          componentsProps={{
            additionalAvatar: {
              component: (args) => {
                const hiddenMembersNames = eventsManagers.slice(args.children[1]).map(member => member.name).join(', ');
                return (
                  <Tooltip key={1} title={hiddenMembersNames} placement="top" children={<Avatar {...args} />} />
                )
              },
              sx: {
                cursor: 'pointer',
                '&:focus, &:hover': {
                  zIndex: "10",
                }
              }
            }
          }}
        >
          {
            eventsManagers.map(({ imageUrl, email, fullname }) => (
              <Tooltip key={email} title={fullname} placement="top">
                <Avatar
                  src={imageUrl || "/"}
                  alt={fullname}
                  sx={{
                    cursor: 'pointer',
                    '&:focus, &:hover': {
                      zIndex: "10",
                    }
                  }}
                />
              </Tooltip>
            ))
          }
        </AvatarGroup>
      </SoftBox>
      <SoftBox>
        <Divider orientation="vertical" variant="middle" />
      </SoftBox>
      <SoftBox display="flex" justifyContent="center" alignItems="center">
        <EventsManagersButton managers={selectableManagers} onSelect={onAddManager} />
      </SoftBox>
    </SoftBox>
  )
}

export default EventGroupMembers;