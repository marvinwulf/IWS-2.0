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

const PeriodDeviceDataChart = ({ UIDParam, threshold }) => {
  const [dataList, setDataList] = useState([]);
  const [xData, setXData] = useState([]);

  const generateDateRange = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 28; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split("T")[0]); // Format YYYY-MM-DD
    }

    return dates.reverse();
  };

  useEffect(() => {
    generateDateRange();
  }, []);

  return (
    <div className="w-full h-full">
      <ThemeProvider theme={darkTheme}>
        <LineChartPro
          xAxis={[
            {
              data: xData,
              scaleType: "point",
              tickLabelStyle: {
                angle: -45,
                textAnchor: "end",
                fontSize: 12,
              },
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
              label: "Bodenfeuchte", // Soil Moisture
              data: dataList,
              connectNulls: true, // Ensures gaps are not skipped
            },
            {
              showMark: false,
              data: new Array(xData.length).fill(threshold), // Threshold line
              color: "gray",
            },
          ]}
          grid={{ horizontal: true }}
        />
      </ThemeProvider>
    </div>
  );
};

export default PeriodDeviceDataChart;
