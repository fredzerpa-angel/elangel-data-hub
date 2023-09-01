// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";

// Soft UI Dashboard React examples
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import Footer from "components/Footer/Dashboard";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
