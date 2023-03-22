

const gradientLineChartData = {
  labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Mobile apps",
      color: "white",
      data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
    },
  ],
  // Clean chart
  options: {
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        }
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        }
      }
    }
  }
};

export default gradientLineChartData;
