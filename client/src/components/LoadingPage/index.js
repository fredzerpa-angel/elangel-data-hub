import { Grid, LinearProgress, Typography } from "@mui/material";
import logo from 'assets/images/el-angel/logo.png';

const LoadingPage = ({ message = '' }) => {

  return (
    <Grid container justifyContent='center' alignItems='center' height='calc(100vh - 16px)'>
      <Grid item xs={8} sm={5} md={4} lg={3}>
        <img src={logo} alt='El Angel Logo' width='100%' />
        <LinearProgress />
        <Typography mt={2} align="center">
          {message}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default LoadingPage;