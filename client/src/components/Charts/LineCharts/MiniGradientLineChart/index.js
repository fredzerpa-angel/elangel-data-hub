

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

// MiniGradientLineChart configurations
import configs from "components/Charts/LineCharts/MiniGradientLineChart/configs";

// Soft UI Dashboard React base styles
import colors from "assets/theme/base/colors";
import { Grid } from "@mui/material";

const MiniGradientLineChart = ({ title, description, height, chart, container }) => {
  const chartDatasets = chart.datasets
    ? chart.datasets.map((dataset) => ({
        ...dataset,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointBackgroundColor: colors[dataset.color]
          ? colors[dataset.color || "dark"].main
          : colors.dark.main,
        borderColor: colors[dataset.color]
          ? colors[dataset.color || "dark"].main
          : colors.dark.main,
        maxBarThickness: 6,
      }))
    : [];

  const { data, options } = configs(chart.labels || [], chartDatasets);

  const renderChart = (
    <SoftBox p={2}>
      <Grid container alignItems="center">
        {title && (
          <Grid item xs={12}>
            <SoftBox mb={1}>
              <SoftTypography variant="h6" fontWeight="regular">{title}</SoftTypography>
            </SoftBox>
          </Grid>
        )}
        <Grid item xs={12}>
          {useMemo(
            () => (
              <SoftBox height={height}>
                <Line data={data} options={options} />
              </SoftBox>
            ),
            [chart, height]
          )}
        </Grid>
      </Grid>
    </SoftBox>
  );

  return title || description ? <Card {...container}>{renderChart}</Card> : renderChart;
}

// Setting default values for the props of MiniGradientLineChart
MiniGradientLineChart.defaultProps = {
  title: "",
  description: "",
  height: "19.125rem",
};

// Typechecking props for the MiniGradientLineChart
MiniGradientLineChart.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chart: PropTypes.objectOf(PropTypes.array).isRequired,
};

export default MiniGradientLineChart;
