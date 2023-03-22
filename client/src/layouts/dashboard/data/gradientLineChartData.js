

const gradientLineChartData = {
  labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Mobile apps",
      color: "info",
      data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
    },
    {
      label: "Websites",
      color: "dark",
      data: [30, 90, 40, 140, 290, 290, 340, 230, 400],
    },
  ],
  // Clean chart
  // options: {
  //   scales: {
  //     x: {
  //       grid: {
  //         display: false,
  //       },
  //       ticks: {
  //         display: false,
  //       }
  //     },
  //     y: {
  //       grid: {
  //         display: false,
  //       },
  //       ticks: {
  //         display: false,
  //       }
  //     }
  //   }
  // }
};

export default gradientLineChartData;
