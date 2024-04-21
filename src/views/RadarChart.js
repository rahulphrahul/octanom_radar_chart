import React, { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import Chart from "chart.js/auto"; // Import chart.js library
import io from "socket.io-client";

const RadarChart = () => {
  const [chartData, setChartData] = useState([]);
  const socket = io("http://localhost:8000");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/user/");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setChartData(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Listen for 'dataChange' event from server
    socket.on("dataChange", () => {
      console.log("Received dataChange event");
      fetchData();
    });
    socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });
    return () => {
      socket.off("dataChange", fetchData);
    };
  }, []);

  const datasets = {};
  chartData.forEach((item) => {
    if (!datasets[item.year]) {
      datasets[item.year] = {
        label: item.year.toString(),
        backgroundColor:
          item.year === 2023 ? "rgba(179,0,0,0.2)" : "rgba(0,0,198,0.2)",
        borderColor: "rgba(179,181,198,1)",
        pointBackgroundColor: "rgba(179,181,198,1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(179,181,198,1)",
        data: [],
      };
    }
    const performanceMetrics = item.performance_metrics;
    datasets[item.year].data.push(...Object.values(performanceMetrics));
  });

  // Data for the radar chart
  const data = {
    labels: [
      "Sales Revenue",
      "Profit Margin",
      "Customer Satisfaction",
      "Market Share",
      "Employee Engagement",
      "Innovation Index",
      "Brand Reputation",
    ],
    datasets: Object.values(datasets),
  };

  // Options for the radar chart
  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        ticks: {
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    },
  };

  return (
    <div style={{ display: "grid", placeItems: "center", height: "100%" }}>
      <div style={{ maxWidth: "600px", width: "100%" }}>
        <Radar data={data} options={options} />
      </div>
    </div>
  );
};

export default RadarChart;
