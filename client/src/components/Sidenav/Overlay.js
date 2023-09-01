// @mui material components
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export default styled(Box)(({ theme, ownerState }) => {
  const { openMobileSidenav } = ownerState;

  document.body.style.overflow = openMobileSidenav ? 'hidden' : 'auto';

  return {
    display: openMobileSidenav ? 'block' : 'none',
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1199, // Sidenav Root has 1200
    backgroundColor: 'rgba(0, 0, 0, 0.5);',
  }
})