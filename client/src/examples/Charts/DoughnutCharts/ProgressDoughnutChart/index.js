// React
import { memo, useMemo } from "react";

// Libraries
import PropTypes from "prop-types";// porp-types is a library for typechecking of props
import { Doughnut } from "react-chartjs-2"; // react-chartjs-2 components
import isEqual from "react-fast-compare";
import Card from "@mui/material/Card"; // @mui material components
import { WorkspacePremium } from "@mui/icons-material";
import { Grid } from "@mui/material";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import BadgeDot from "components/BadgeDot";

// ProgressDoughnutChart configurations
import configs from "examples/Charts/DoughnutCharts/ProgressDoughnutChart/configs";

function ProgressDoughnutChart({ color, icon, title, count, height, chart }) {
  const { data, options } = configs(chart.labels || [], chart.datasets || {}, chart.cutout);

  const renderChart = (
    <Grid p={2} container>
      <Grid item flexDirection="column" xs={8}>
        <SoftBox display="flex" alignItems="center" mb={2}>
          <SoftBox
            variant="gradient"
            bgColor={color}
            color={color !== 'white' ? 'white' : 'dark'}
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
          <SoftBox display="flex" flexDirection="column">
            <SoftTypography variant="button" color="text">{title}</SoftTypography>
            <SoftTypography variant="button" fontSize="large">
              {count}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
        <SoftBox display="flex" flexDirection="column" ml={2}>
          {
            chart.labels.map((label, idx) => {
              const color = chart.datasets.backgroundColors[idx] || "info";
              return (
                <SoftBox key={label}>
                  <BadgeDot content={label} color={color} variant="gradient" />
                </SoftBox>
              )
            })
          }
        </SoftBox>
      </Grid>
      {useMemo(
        () => (
          <Grid item height={height} xs={4}>
            <Doughnut data={data} options={options} />
          </Grid>
        ),
        [data, height, options]
      )}
    </Grid>
  );

  return title ? <Card>{renderChart}</Card> : renderChart;
}

// Setting default values for the props of ProgressDoughnutChart
ProgressDoughnutChart.defaultProps = {
	color: "info",
	icon: <WorkspacePremium />,
  title: "Projects",
  count: 0,
  height: "auto",
	chart: {
		labels: [],
		datasets: {}
	}
};

// Typechecking props for the ProgressDoughnutChart
ProgressDoughnutChart.propTypes = {
	color: PropTypes.oneOf([
		"primary",
		"secondary",
		"info",
		"success",
		"warning",
		"error",
		"dark",
	]),
	icon: PropTypes.node,
  title: PropTypes.string,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chart: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.array, PropTypes.object])).isRequired,
};

export default memo(ProgressDoughnutChart, isEqual);
