import { useState } from 'react';
import { MoreVert } from '@mui/icons-material';
import { Box, Divider, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';
import SoftButton from 'components/SoftButton';

const SettingsMenu = ({ button, menu, items }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const openMenu = event => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null)

  const renderItems = items.map((item, idx, arr) => {
    const isLastItem = ++idx === arr.length;
    return (
      <Box key={idx}>
        <MenuItem onClick={item?.action ?? null}>
          <ListItemIcon>
            {item?.icon}
          </ListItemIcon>
          <ListItemText
            primary={item?.label}
            primaryTypographyProps={{
              sx: (theme) => ({ color: theme?.palette[item.color]?.main }), variant: "button", textTransform: "capitalize", fontWeight: "regular"
            }}
          />
        </MenuItem>
        {!isLastItem && <Divider />}
      </Box>
    )
  })

  return (
    <>
      <SoftButton
        onClick={openMenu}
        aria-controls={open ? 'settings-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        iconOnly
        size="large"
        variant="text"
        color="secondary"
        sx={{ pl: 0 }}
        {...button}
      >
        <MoreVert />
      </SoftButton>

      <Menu
        anchorEl={anchorEl}
        id="settings-menu"
        open={open}
        onClose={closeMenu}
        onClick={closeMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        {...menu}
      >
        {
          renderItems
        }
      </Menu>
    </>
  );
}

SettingsMenu.defaultProps = {
  button: {},
  menu: {},
  items: [{}],
}

SettingsMenu.propTypes = {
  button: PropTypes.object,
  menu: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default SettingsMenu;