import { useMemo } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Students page components
import ProgressDoughnutChart from "examples/Charts/DoughnutCharts/ProgressDoughnutChart";
import DataTable from "components/DataTable";
import { studentsData } from "./data/studentsData";
import { Card } from "@mui/material";
import MiniGradientLineChart from "examples/Charts/LineCharts/MiniGradientLineChart";

const Students = () => {
  const columns = useMemo(
    //column definitions...
    () => [
      {
        accessorKey: "firstName",
        header: "First Name",
        size: 150,
      },
      {
        accessorKey: "middleName",
        header: "Middle Name",
        size: 150,
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        size: 150,
      },
      {
        accessorKey: "email",
        header: "Email Address",
        size: 300,
      },
      {
        accessorKey: "address",
        header: "Address",
      },
      {
        accessorKey: "zipCode",
        header: "Zip Code",
      },
      {
        accessorKey: "city",
        header: "City",
      },
      {
        accessorKey: "state",
        header: "State",
      },
      {
        accessorKey: "country",
        header: "Country",
      },
    ],
    []
    //end
  );
  
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox mt={4}>
        <SoftBox mb={1.5}>
          <Grid container item spacing={3} xs={12}>
            <Grid container item spacing={3} xs={12}>
              <Grid container item xs={12} spacing={2}>
                <Grid item xs={12} sm={6} lg={4}>
                  <MiniGradientLineChart
                    title="Mini Gradient Line Chart"
                    height="7rem"
                    chart={{
                      labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                      datasets: [
                        {
                          label: 'Visitors',
                          color: 'info',
                          data: [50, 45, 60, 60, 80, 65, 90, 80, 100],
                        },
                      ],
                    }}
                    container={{ sx: {height: "100%"} }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} lg={4}>
                  <ProgressDoughnutChart
                    color="info"
                    title="Projects"
                    count="444/592"
                    chart={{
                      labels: ['Listos', 'En progreso'],
                      datasets: {
                        backgroundColors: ['info', 'secondary'],
                        data: [75, 25],
                      },
                    }}
                    container={{
                      sx: { height: "100%" }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Card
                sx={{
                  width: '100%',
                }}
              >
                <DataTable columns={columns} data={studentsData} />
              </Card>
            </Grid>
          </Grid>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Students;
