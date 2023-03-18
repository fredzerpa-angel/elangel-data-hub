import { useState } from 'react';
import { Logout, Person } from '@mui/icons-material';
import { Avatar, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useAuth } from 'context/auth.context';
import { useNavigate } from 'react-router-dom';
import AuthApi from 'api/auth';

const AccountMenu = ({ buttonProps, menuProps }) => {
  const { user, setUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null)

  const handleLogout = async () => {
    await AuthApi.logout(user);
    setUser(null);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="large"
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        {...buttonProps}
      >
        <Avatar alt={user?.fullname} src={user?.imageUrl} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        {...menuProps}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary='Perfil'
            primaryTypographyProps={{
              variant: "button", textTransform: "capitalize", fontWeight: "regular"
            }}

          />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary='Cerrar Sesion'
            primaryTypographyProps={{
              variant: "button", textTransform: "capitalize", fontWeight: "regular"
            }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}

export default AccountMenu;