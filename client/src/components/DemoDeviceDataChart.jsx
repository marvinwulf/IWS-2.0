import { useState, useEffect } from "react";
import { LineChartPro } from "@mui/x-charts-pro/LineChartPro";
import { LicenseInfo } from "@mui/x-license";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";

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

const DemoDeviceDataChart = ({ UIDParam, threshold }) => {
  const [dataListMoisture, setDataListMoisture] = useState([]);
  const [dataListBattery, setDataListBattery] = useState([]);
  const [dataListTank, setDataListTank] = useState([]);

  const [xDataRolling, setXDataRolling] = useState([]);

  const fetchLatestData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/datalogRolling?UID=${UIDParam}`);
      setDataListMoisture((prevData) => [...prevData, response.data.soilMoisture]);
      setDataListBattery((prevData) => [...prevData, response.data.batLevel]);
      setDataListTank((prevData) => [...prevData, response.data.tankLevel]);

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
  }, [UIDParam]);

  useEffect(() => {
    if (dataListMoisture.length > 23) {
      setDataListMoisture([]);
      setDataListBattery([]);
      setDataListTank([]);

      fetchLatestData();
      generateXData();
    }
  }, [dataListMoisture]);

  // Format time as HH:MM:SS
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="w-full h-full">
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
              data: dataListMoisture,
            },
            {
              showMark: false,
              label: "Wasserstand",
              data: dataListTank,
              yAxisId: "tankLevelAxis",
            },
            {
              showMark: false,
              label: "Batterieladung",
              data: dataListBattery,
            },
            // **Horizontal Line Series**
            {
              showMark: false,
              data: new Array(xDataRolling.length).fill(threshold),
              color: "gray",
            },
          ]}
          grid={{ horizontal: true }}
        />
      </ThemeProvider>
    </div>
  );
};

export default DemoDeviceDataChart;
