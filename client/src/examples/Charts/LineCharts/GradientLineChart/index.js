

import { useRef, useEffect, useState, useMemo, memo } from "react";

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Line } from "react-chartjs-2";

// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React helper functions
import gradientChartLine from "assets/theme/functions/gradientChartLine";

// GradientLineChart configurations
import configs from "examples/Charts/LineCharts/GradientLineChart/configs";

// Soft UI Dashboard React base styles
import colors from "assets/theme/base/colors";
import isEqual from "react-fast-compare";

function GradientLineChart({ title, description, chart, ...rest }) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    // Placeholders for initial state, helps with undefined errors
    labels: [],
    data: {
      datasets: [],
    },
    options: {},
  });
  const { data, options } = chartData;

  useEffect(() => {
    const chartDatasets = chart.datasets
      ? chart.datasets.map((dataset) => ({
        ...dataset,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 3,
        borderColor: colors[dataset.color]
          ? colors[dataset.color || "dark"].main
          : colors.dark.main,
        fill: true,
        maxBarThickness: 6,
        backgroundColor: gradientChartLine(
          chartRef.current.children[0],
          colors[dataset.color] ? colors[dataset.color || "dark"].main : colors.dark.main
        ),
      }))
      : [];

    setChartData(configs(chart.labels || [], chartDatasets, chart.options));
  }, [chart]);

  const renderChart = (
    <SoftBox {...rest}>
      {title || description ? (
        <SoftBox>
          <SoftBox mb={1}>
            {
              typeof title === 'string' ?
                (
                  <SoftTypography variant="h6">{title}</SoftTypography>
                ) : title
            }
          </SoftBox>
          <SoftBox mb={2}>
            {
              typeof description === 'string' ?
                (
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    {description}
                  </SoftTypography>
                ) : description
            }
          </SoftBox>
        </SoftBox>
      ) : null}
      {useMemo(
        () => (
          <SoftBox ref={chartRef} sx={{ height: chart.height }}>
            <Line data={data} options={options} redraw />
          </SoftBox>
        ),
        [chart.height, data, options]
      )}
    </SoftBox>
  );

  return title || description ? <Card>{renderChart}</Card> : renderChart;
}

// Setting default values for the props of GradientLineChart
GradientLineChart.defaultProps = {
  title: "",
  description: "",
  height: "19.125rem",
};

// Typechecking props for the GradientLineChart
GradientLineChart.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  background: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  chart: PropTypes.object.isRequired,
};


export default memo(GradientLineChart, isEqual);
