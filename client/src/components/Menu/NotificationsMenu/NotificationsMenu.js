import { useState } from 'react';

// Libraries
import { IconButton, Menu } from '@mui/material';
import { Notifications, Payment } from '@mui/icons-material';

// Components
import NotificationItem from 'components/Items/NotificationItem';

const NotificationsMenu = ({ button, menu }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null)

  return (
    <>
      <IconButton
        size="medium"
        color="inherit"
        aria-controls="notification-menu"
        aria-haspopup="true"
        variant="contained"
        onClick={handleClick}
        {...button}
      >
        <Notifications />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        anchorReference={null}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        onClose={handleClose}
        sx={{ mt: 1 }}
        {...menu}
      >
        <NotificationItem
          image={<img src={'#'} alt="person" />}
          title={["New message", "from Laur"]}
          date="13 minutes ago"
          onClick={handleClose}
        />
        <NotificationItem
          image={<img src={'#'} alt="person" />}
          title={["New album", "by Travis Scott"]}
          date="1 day"
          onClick={handleClose}
        />
        <NotificationItem
          color="secondary"
          image={
            <Payment fontSize="small" sx={{ color: ({ palette: { white } }) => white.main }} />
          }
          title={["", "Payment successfully completed"]}
          date="2 days"
          onClick={handleClose}
        />
      </Menu>
    </>
  );
}

export default NotificationsMenu;