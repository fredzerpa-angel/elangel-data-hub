

// @mui material components
import Grid from "@mui/material/Grid";

// @mui icons
import LanguageIcon from '@mui/icons-material/Language';
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";

const Footer = () => {
  return (
    <SoftBox component="footer" py={3}>
      <Grid container justifyContent="center">
        <Grid item xs={12} lg={8}>
          <SoftBox display="flex" gap={2} justifyContent="center" mt={1} mb={3}>
            <SoftButton iconOnly color="secondary" variant="text" size="large" href="https://elangel.edu.ve/" target="_blank">
              <LanguageIcon fontSize="medium" />
            </SoftButton>
            <SoftButton iconOnly color="secondary" variant="text" size="large" href="https://www.facebook.com/UnidadEducativaElAngel" target="_blank">
              <FacebookIcon fontSize="medium" />
            </SoftButton>
            <SoftButton iconOnly color="secondary" variant="text" size="large" href="https://twitter.com/ueelangel" target="_blank">
              <TwitterIcon fontSize="medium" />
            </SoftButton>
            <SoftButton iconOnly color="secondary" variant="text" size="large" href="https://www.instagram.com/ueelangel/" target="_blank">
              <InstagramIcon fontSize="medium" />
            </SoftButton>
          </SoftBox>
        </Grid>
        <Grid item xs={12} lg={8} sx={{ textAlign: "center" }}>
          <SoftTypography variant="body2" color="secondary">
            Copyright &copy; {new Date().getFullYear()} ASOCOL El Angel.
          </SoftTypography>
        </Grid>
      </Grid>
    </SoftBox>
  );
}

export default Footer;
