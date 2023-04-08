import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Tooltip } from '@mui/material';
import SoftButton from 'components/SoftButton';
import { Add } from '@mui/icons-material';
import SoftAvatar from 'components/SoftAvatar';
import SoftTypography from 'components/SoftTypography';
import SoftBox from 'components/SoftBox';

export const EventsManagersDialog = ({ close, open, managers, onSelect }) => {
  const handleUserClick = async (user) => {
    await onSelect(user);
    close();
  }

  return (
    <Dialog onClose={close} open={open}>
      {

        managers.length ?
          (
            <>
              <DialogTitle>Agregar administrador de eventos</DialogTitle>
              <List sx={{ pt: 0 }}>
                {managers.map((user) => (
                  <ListItem key={user.fullname} disableGutters>
                    <ListItemButton onClick={() => handleUserClick(user)} key={user.email}>
                      <ListItemAvatar>
                        <SoftAvatar src={user.imageUrl || "/"} alt={user.fullname} variant="rounded" bgColor="dark" />
                      </ListItemAvatar>
                      <ListItemText sx={{ textAlign: "center" }} primary={user.fullname} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </>
          )
          :
          <SoftBox display="flex" alignItems="center" justifyContent="center" p={3}>
            <SoftTypography textAlign="center" variant="body2" fontWeight="regular">
              No existen usuarios seleccionables
            </SoftTypography>
          </SoftBox>
      }
    </Dialog>
  );
}


const EventsManagersButton = ({ managers, onSelect }) => {
  const [open, setOpen] = React.useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <>
      <Tooltip title="Agregar Administrador" placement="top">
        <SoftButton variant="outlined" color="dark" iconOnly onClick={openModal}>
          <Add />
        </SoftButton>
      </Tooltip>
      <EventsManagersDialog
        managers={managers}
        open={open}
        close={closeModal}
        onSelect={onSelect}
      />
    </>
  );
}

export default EventsManagersButton;