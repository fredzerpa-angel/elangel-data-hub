

import { useMemo } from "react";

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Line } from "react-chartjs-2";

// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// ProgressLineChart configurations
import configs from "components/Charts/LineCharts/ProgressLineChart/configs";

// Soft UI Dashboard React base styles
import colors from "assets/theme/base/colors";
import { DateRange } from "@mui/icons-material";
import rgba from "assets/theme/functions/rgba";
import SoftProgress from "components/SoftProgress";

const ProgressLineChart = ({ color, icon, title, count, progress, height, chart }) => {
  const chartDatasets = [{
    ...chart,
    fill: true,
    tension: 0.4,
    borderWidth: 2,
    pointRadius: 2,
    pointBackgroundColor: colors[color].main,
    borderColor: colors[color].main,
    backgroundColor: rgba(colors[color].main, 0.2),
    maxBarThickness: 6,
  }]


  const { data, options } = configs(chart?.labels || [], chartDatasets);

  const renderChart = (
    <SoftBox p={2}>
      <SoftBox display="flex" alignItems="center" mb={1} width="100%">
        <SoftBox
          variant="gradient"
          bgColor="info"
          color="white"
          width="3rem"
          height="3rem"
          borderRadius="md"
          display="flex"
          justifyContent="center"
          alignItems="center"
          shadow="md"
          mr={2}
        >
          {icon}
        </SoftBox>

        <SoftBox display="flex" flexDirection="column" justifyContent="center">
          <SoftTypography variant="button" color="text">{title}</SoftTypography>
          <SoftTypography variant="button" fontSize="large">{count}</SoftTypography>
        </SoftBox>

        {
          progress && (
            <SoftBox width="35%" sx={{ ml: "auto" }}>
              <SoftProgress variant="gradient" color={color} value={progress} label />
            </SoftBox>
          )
        }

      </SoftBox>
      {useMemo(
        () => (
          <SoftBox height={height}>
            <Line data={data} options={options} />
          </SoftBox>
        ),
        [data, height, options]
      )}
    </SoftBox>
  );

  return title ? <Card>{renderChart}</Card> : renderChart;
}

// Setting default values for the props of ProgressLineChart
ProgressLineChart.defaultProps = {
  color: "info",
  icon: <DateRange />,
  title: "Progress Chart",
  count: 0,
  height: "6.25rem"
};

// Typechecking props for the ProgressLineChart
ProgressLineChart.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  progress: PropTypes.number,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chart: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
};

export default ProgressLineChart;
