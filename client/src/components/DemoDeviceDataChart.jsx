import { useState, useEffect } from "react";
import { LineChartPro } from "@mui/x-charts-pro/LineChartPro";
import { LicenseInfo } from "@mui/x-license";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";

import SERVER_CONFIG from "../../../serverConfig";

LicenseInfo.setLicenseKey(
  "e0d9bb8070ce0054c9d9ecb6e82cb58fTz0wLEU9MzI0NzIxNDQwMDAwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxLVj0y"
);

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#252134",
    },
    text: {
      primary: "#757185",
      secondary: "#b0b0b0",
    },
  },
});

const DemoDeviceDataChart = ({ UIDParam, threshold, isActive }) => {
  const [moistureSeries, setMoistureSeries] = useState([]);
  const [batterySeries, setBatterySeries] = useState([]);
  const [tankSeries, setTankSeries] = useState([]);
  const [pumpSeries, setPumpSeries] = useState([]);

  const [xDataRolling, setXDataRolling] = useState([]);

  const fetchLatestData = async () => {
    try {
      const response = await axios.get(`${SERVER_CONFIG.API_URL}/datalogRolling?UID=${UIDParam}`);

      // Add data to series only if isActive is 1, otherwise add null
      setMoistureSeries((prevData) => [...prevData, isActive === 1 ? response.data.soilMoisture : null]);
      setBatterySeries((prevData) => [...prevData, isActive === 1 ? response.data.batLevel : null]);
      setTankSeries((prevData) => [...prevData, isActive === 1 ? response.data.tankLevel : null]);
      setPumpSeries((prevData) => [...prevData, isActive === 1 ? (response.data.pumpActive === 1 ? 100 : null) : null]);

      console.log(response.data);
    } catch (err) {
      console.error("Error fetching data:", err.response ? err.response.data : err.message);
    }
  };

  const generateXData = () => {
    const currentDate = new Date();
    const newXDataRolling = [];

    for (let i = 0; i < 24; i++) {
      const timestamp5s = new Date(currentDate.getTime() + i * 5000 - 5000);
      newXDataRolling.push(timestamp5s);
    }

    setXDataRolling(newXDataRolling);
    fetchLatestData();
  };

  useEffect(() => {
    generateXData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLatestData();
    }, 5000);

    return () => clearInterval(interval);
  }, [UIDParam, isActive]);

  useEffect(() => {
    if (moistureSeries.length > 23) {
      setMoistureSeries([]);
      setBatterySeries([]);
      setTankSeries([]);
      setPumpSeries([]);

      fetchLatestData();
      generateXData();
    }
  }, [moistureSeries]);

  // Format time as HH:MM:SS
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className={`w-full h-full transition-opacity duration-150 ${isActive === 1 ? "opacity-100" : "opacity-40"}`}>
      <ThemeProvider theme={darkTheme}>
        <LineChartPro
          xAxis={[
            {
              data: xDataRolling,
              scaleType: "point",
              valueFormatter: (value) => formatTime(value),
            },
          ]}
          yAxis={[
            { id: "percentageAxis", min: -0.5, max: 100.5 },
            {
              id: "tankLevelAxis",
              min: -0.5,
              max: 2.5,
              tickMinStep: 1,
              valueFormatter: (value) => {
                const labels = { 0: "Leer", 1: "", 2: "Voll" };
                return labels[value] ?? "";
              },
            },
          ]}
          leftAxis="percentageAxis"
          rightAxis="tankLevelAxis"
          series={[
            {
              showMark: false,
              label: "Bodenfeuchte",
              data: moistureSeries,
              connectNulls: false,
              valueFormatter: (value) => `${value !== null ? value + "%" : ""}`,
            },
            {
              showMark: false,
              label: "Wasserstand",
              data: tankSeries,
              yAxisId: "tankLevelAxis",
              connectNulls: false,
              valueFormatter: (value) =>
                value !== null ? (value === 2 ? "Voll" : value === 1 ? "Halbvoll" : "Leer") : "",
            },
            {
              showMark: false,
              label: "Batterieladung",
              data: batterySeries,
              connectNulls: false,
              valueFormatter: (value) => `${value !== null ? value + "%" : ""}`,
            },
            {
              label: (location) => `${location === "legend" ? "" : "Pumpe"}`,
              data: pumpSeries,
              color: "white",
              showMark: true,
              markerSize: 8,
              tooltip: false,
              valueFormatter: (value) => (value === 100 ? "Aktiviert" : ""),
            },
            {
              label: (location) => `${location === "legend" ? "" : "Schwellenwert"}`,
              showMark: false,
              data: new Array(xDataRolling.length).fill(threshold), // Threshold line
              color: "gray",
              valueFormatter: (value) => `${Math.round(value)}%`,
            },
          ]}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              itemMarkWidth: 20,
              itemMarkHeight: 2,
              markGap: 5,
              itemGap: 10,
            },
          }}
        />
      </ThemeProvider>
      <div className="absolute top-[21px] w-full">
        <div className="flex ml-6 gap-1">
          <div className={`w-1 h-1 transition-all rounded-full bg-gray-600 ${isActive === 1 ? "dot" : ""}`}></div>
          <div className={`w-1 h-1 transition-all rounded-full bg-gray-600 ${isActive === 1 ? "dot" : ""}`}></div>
          <div className={`w-1 h-1 transition-all rounded-full bg-gray-600 ${isActive === 1 ? "dot" : ""}`}></div>
        </div>
      </div>
    </div>
  );
};

export default DemoDeviceDataChart;
