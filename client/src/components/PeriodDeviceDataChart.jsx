import { useState, useEffect } from "react";
import { LineChartPro } from "@mui/x-charts-pro/LineChartPro";
import { LicenseInfo } from "@mui/x-license";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";

import { format } from "date-fns";
import { de } from "date-fns/locale";

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
  const [xData, setXData] = useState([]);
  const [moistureSeries, setMoistureSeries] = useState([]);
  const [tankSeries, setTankSeries] = useState([]);
  const [batterySeries, setBatterySeries] = useState([]);
  const [pumpSeries, setPumpSeries] = useState([]);

  const [days, setDays] = useState([28]);

  const generateDateRange = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split("T")[0]); // "YYYY-MM-DD"
    }

    return dates.reverse();
  };

  useEffect(() => {
    const dates = generateDateRange();
    setXData(dates);

    axios
      .get(`http://localhost:8080/datalog`, {
        params: { UID: UIDParam, startDate: new Date().toISOString().split("T")[0], days: days },
      })
      .then((response) => {
        console.log("API Response:", response.data); // Debug API response

        // Convert API response to dictionaries for each series
        const moistureMap = {};
        const tankMap = {};
        const batteryMap = {};
        const pumpMap = {};

        response.data.forEach((entry) => {
          moistureMap[entry.date] = entry.soilMoisture;
          tankMap[entry.date] = entry.tankLevel;
          batteryMap[entry.date] = entry.batLevel;
          pumpMap[entry.date] = entry.pumpActive;
        });

        console.log("Processed Data Maps:", { moistureMap, tankMap, batteryMap, pumpMap }); // Debug transformed data

        // Map the dates to series, ensuring missing data is handled with `null`
        setMoistureSeries(dates.map((date) => moistureMap[date] ?? null));
        setTankSeries(dates.map((date) => tankMap[date] ?? null));
        setBatterySeries(dates.map((date) => batteryMap[date] ?? null));
        setPumpSeries(dates.map((date) => pumpMap[date] ?? null).map((value) => (value === 1 ? 100 : null)));

        console.log("Final Series Data:", {
          moistureSeries,
          tankSeries,
          batterySeries,
          pumpSeries,
        }); // Debug final series
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setMoistureSeries(new Array(days).fill(null));
        setTankSeries(new Array(days).fill(null));
        setBatterySeries(new Array(days).fill(null));
        setPumpSeries(new Array(days).fill(null));
      });
  }, [UIDParam]);

  return (
    <div className="w-full h-full">
      <ThemeProvider theme={darkTheme}>
        <LineChartPro
          xAxis={[
            {
              data: xData.map(
                (date) => format(new Date(date), "d. MMM", { locale: de }) // Format to "18. Aug"
              ),
              scaleType: "point",
              tickLabelStyle: {
                angle: -45,
                textAnchor: "end",
                fontSize: 12,
              },
              zoom: {
                minStart: 0,
                maxEnd: 100,
                minSpan: 20,
                step: 5,
                panning: true,
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
              label: "Pumpe",
              data: pumpSeries,
              color: "white",
              showMark: true,
              markerSize: 8,
            },
            {
              showMark: false,
              label: "Bodenfeuchte", // Soil Moisture
              data: moistureSeries,
              connectNulls: true, // Ensures gaps are not skipped
            },
            {
              showMark: false,
              label: "Wasserstand", // Soil Moisture
              data: tankSeries,
              yAxisId: "tankLevelAxis",
              connectNulls: true, // Ensures gaps are not skipped
            },
            {
              showMark: false,
              label: "Batterieladung", // Soil Moisture
              data: batterySeries,
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
