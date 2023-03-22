

// @mui material components
import { Grid } from "@mui/material";

// @mui material icons
import { ArrowUpward } from "@mui/icons-material";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";
import EventsOverview from "./components/EventsOverview";

import Calendar from "components/Calendar";
import gradientLineChartData from "./data/gradientLineChartData";

import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import GroupMembers from "./components/GroupMembers";
import AddEventButton from "./components/AddEventButton";

function Events() {
  const members = [
    { image: team1, name: "Ryan Tompson" },
    { image: team2, name: "Romina Hadid" },
    { image: team3, name: "Alexander Smith" },
    { image: team4, name: "Jessica Doe" },
    { image: team1, name: "Ryan Tompson" },
    { image: team2, name: "Romina Hadid" },
    { image: team3, name: "Alexander Smith" },
    { image: team4, name: "Jessica Doe" },
  ]

  const events = [
    {
      title: "TALLER SENSIBILIZACIÓN EN TURISMO Y PATRIMONIO",
      start: "2023-03-04",
      end: "2023-03-06",
      color: "success",
    },
    {
      title: "V RETO ESTUDIANTIL MATEMATICAS",
      start: "2023-03-08",
      end: "2023-03-08",
      color: "warning",
    },
    {
      title: "TALLER SENSIBILIZACIÓN EN TURISMO Y PATRIMONIO",
      start: "2023-03-10",
      end: "2023-03-10",
      color: "info",
    },
    {
      title: "FORMACIÓN DE PROMOTORES DE ACTIVIDADES CIENTÍFICAS EDUCATIVAS",
      start: "2023-03-22",
      end: "2023-03-25",
      color: "error",
    },
  ]

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox display="flex" justifyContent="space-between" width="100%" mb={3} px={2}>
          <SoftBox display="flex" alignItems="flex-end">
            <AddEventButton />
          </SoftBox>
          <GroupMembers members={members} />
        </SoftBox>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={9}>
              <Calendar
                events={events}
              />
            </Grid>

            <Grid item xs={12} lg={3}>

              <SoftBox mb={3}>
                <EventsOverview events={events} />
              </SoftBox>

              <SoftBox mb={3}>
                <GradientLineChart
                  title={
                    <SoftTypography variant="h6" color="white">Participantes</SoftTypography>
                  }
                  description={
                    <SoftBox display="flex" alignItems="center">
                      <SoftBox fontSize='large' color="success" mr={0.5} lineHeight={0}>
                        <ArrowUpward />
                      </SoftBox>
                      <SoftTypography variant="button" color="white" fontWeight="regular">
                        <strong>4% mas</strong> en Marzo
                      </SoftTypography>
                    </SoftBox>
                  }
                  p={0}
                  sx={{
                    background: 'linear-gradient(310deg, rgb(20, 23, 39), rgb(58, 65, 111))',
                    '& > :first-of-type': {
                      paddingTop: 2,
                      paddingX: 2,
                    }
                  }}
                  height="100%"
                  chart={{ ...gradientLineChartData, height: '5rem' }}
                />
              </SoftBox>

            </Grid>
          </Grid>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Events;
