import Chart from "react-apexcharts"
import { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react"

const RsiChart = ({ data, categories }) => {
  const series = [
    {
      name: "RSI",
      data: data
    }
  ];

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 150,
      toolbar: { show: false }
    },
    xaxis: {
      categories: categories,  // array of date strings
      tickAmount: 6            // shows fewer date labels
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        formatter: (value: number) => value.toFixed(0)
      }
    }
  };

  return <Chart options={options} series={series} type="line" height={150} />;
};

export default RsiChart;