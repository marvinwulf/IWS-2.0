import React, { useState } from "react";
import Switch from "./Switch";
import Fader from "./FaderWithDetails";
import Icon from "@mdi/react";
import { mdiClose, mdiPencil } from "@mdi/js";

import { LineChart } from "@mui/x-charts/LineChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

const getWlIndicatorColors = (tankLevel, barIndex) => {
  const colors = {
    0: ["bg-red-600 blink2", "bg-amber-500", "bg-green-500"],
    1: ["bg-n-6", "bg-amber-500", "bg-green-500"],
    2: ["bg-n-6", "bg-n-6", "bg-green-500"],
  };
  return colors[barIndex][tankLevel] || "bg-gray-500";
};

const timeDelta = (sqlDatetime) => {
  const pastDate = new Date(sqlDatetime);
  const currentDate = new Date();
  const currentGMTDate = new Date(currentDate.toUTCString().slice(0, -4));

  let delta = Math.abs(currentGMTDate.getTime() - pastDate.getTime()) / 1000; // delta in seconds

  const seconds = Math.floor(delta % 60);
  delta = Math.floor(delta / 60); // delta in minutes

  const minutes = Math.floor(delta % 60);
  delta = Math.floor(delta / 60); // delta in hours

  const hours = Math.floor(delta % 24);
  const days = Math.floor(delta / 24); // delta in days

  const formatTime = (value, singular, plural) => {
    return value === 1 ? singular : plural;
  };

  if (days > 0) {
    return `${days} ${formatTime(days, "Tag", "Tagen")} und ${hours} ${formatTime(hours, "Stunde", "Stunden")}`;
  } else if (hours > 0) {
    return `${hours} ${formatTime(hours, "Stunde", "Stunden")}`;
  } else if (minutes > 0) {
    return `${minutes} ${formatTime(minutes, "Minute", "Minuten")}`;
  } else {
    return `${seconds} ${formatTime(seconds, "Sekunde", "Sekunden")}`;
  }
};

const DeviceMenuMaxLgUI = ({ deviceData, onClose, handleSwitchChange, handleFaderChange }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Desktop Top Bar */}
      <div
        id="top-bar-container"
        className="relative flex items-center gap-2 h-[72px] w-full border-b border-n-6 mb-2 pb-2"
      >
        <div id="top-bar-left" className="relative h-full w-[260px] flex justify-center items-center">
          <div className="absolute left-3">
            <Switch id="statusSwitch" checked={deviceData.isActive} onChange={handleSwitchChange} />
          </div>
          <div className="absolute h-8 left-[75px] border-r border-n-5"></div>
          <div className="absolute h-8 right-[75px] border-r border-n-5"></div>
          <p className="text-center text-sm font-300 text-n-4">{deviceData.isActive ? "Aktiv" : "Standby"}</p>
        </div>

        <div id="top-bar-right" className="flex items-center flex-grow h-full">
          <div>
            <div className="flex items-center gap-2 -mb-1 hover:opacity-75 hover:scale-105 transition-all duration-150 ease-in-out cursor-pointer">
              <p className="text-n-1 text-2xl font-bold whitespace-nowrap max-w-[35vw] overflow-hidden overflow-ellipsis">
                {deviceData.name}
              </p>
              <div className="h-6 aspect-square -mt-1">
                <Icon path={mdiPencil} className="text-n-4"></Icon>
              </div>
            </div>
            <p className="text-n-4 text-sm">UID: {deviceData.UID}</p>
          </div>
        </div>

        <div className="absolute right-3 aspect-square h-8 p-0.5 hover:bg-n-6 rounded-md transition-all ease-in-out ">
          <Icon
            path={mdiClose}
            className="text-n-4 hover:text-n-3 transition-all ease-in-out cursor-pointer"
            onClick={onClose}
          ></Icon>
        </div>
      </div>

      {/* Bottom Screen */}
      <div id="bottom-screen-container" className="flex flex-grow gap-2">
        <div id="settings-col" className="flex justify-center">
          <div className="flex flex-col gap-2 w-[260px]">
            {/* Soil Card */}
            <div className="bg-n-7 px-4 py-3 border border-n-6 rounded-md w-full hover:scale-[1.02] transition-all duration-100 ease-in-out">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-n-1">Bodenfeuchte</p>
                <input
                  type="text"
                  value={(deviceData.soilMoisture || "-") + " %"}
                  disabled={true}
                  className="w-16 border border-n-6 rounded-md text-center outline-none text-sm bg-[#0e0c15] text-n-1"
                />
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-n-6">
                <div
                  className="h-full overflow-hidden rounded-full bg-green-500"
                  style={{ width: `${deviceData.soilMoisture || 0}%` }}
                ></div>
              </div>

              <div className="relative h-4">
                <div
                  className="absolute top-[50%] left-0 h-2 w-0.5 rounded-full bg-n-4 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${Math.min(Math.max(1.5, deviceData.soilMoisture - 1), 98.5)}%`,
                  }}
                />
              </div>
              <Fader
                minValue={0}
                maxValue={100}
                initialValue={deviceData.threshold || 0}
                settingName="Schwellenwert"
                deviceDataItem="threshold"
                type="percent"
                fgColor="bg-red-700"
                dotColor="bg-n-1"
                bgColor="bg-green-500"
                onFaderChange={handleFaderChange}
              />
            </div>

            {/* Water Card */}
            <div className="bg-n-7 px-4 py-3 border border-n-6 rounded-md w-full hover:scale-[1.02] transition-all duration-100 ease-in-out">
              <p className="text-sm mb-2">Wasserstand</p>
              <div className="flex gap-0.5 mb-4">
                <div className={`h-2.5 w-[33%] rounded-l-md ${getWlIndicatorColors(deviceData.tankLevel, 0)}`}></div>
                <div className={`h-2.5 w-[33%]  ${getWlIndicatorColors(deviceData.tankLevel, 1)}`}></div>
                <div className={`h-2.5 w-[33%] rounded-r-md ${getWlIndicatorColors(deviceData.tankLevel, 2)}`}></div>
              </div>
              <Fader
                minValue={0}
                maxValue={10000}
                initialValue={deviceData.watervol || 0}
                settingName="Pumpvolumen"
                deviceDataItem="watervol"
                type="volume"
                fgColor="bg-blue-800"
                dotColor="bg-n-1"
                bgColor="bg-n-6"
                onFaderChange={handleFaderChange}
              />
            </div>

            {/* Battery Card */}
            <div className="bg-n-7 px-4 py-3 border border-n-6 rounded-md w-full hover:scale-[1.02] transition-all duration-100 ease-in-out">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm">Batterieladung</p>
                <input
                  type="text"
                  value={(deviceData.batLevel || "-") + " %"}
                  disabled={true}
                  className="w-16 border border-n-6 rounded-md text-center outline-none text-sm bg-[#0e0c15] text-n-1"
                />
              </div>
              <div className="flex-start flex h-2.5 w-full overflow-hidden rounded-full bg-n-6 font-sans text-xs font-medium">
                <div
                  className="flex h-full items-center justify-center overflow-hidden break-all rounded-full bg-green-500 text-n-1"
                  style={{ width: `${deviceData.batLevel || 0}%` }}
                ></div>
              </div>
            </div>

            {deviceData.timestamp != null ? (
              <div className="text-sm text-n-4 text-center mt-3 mb-5">
                <p>Zulezt verbunden vor</p>
                <p>{`${timeDelta(deviceData.timestamp) || "-"}`}</p>
                <p>{`(${deviceData.timestamp} GMT)`}</p>
              </div>
            ) : (
              <p className="text-sm text-n-4 text-center">Gerät noch nie verbunden</p>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-grow rounded-md border border-n-6 bg-n-7 overflow-hidden">
          <div className="flex-grow">
            <div className="w-full h-full">
              <LineChart
                sx={(theme) => ({
                  [`.${axisClasses.root}`]: {
                    [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                      stroke: "#757185",
                      strokeWidth: 2,
                    },
                    [`.${axisClasses.tickLabel}`]: {
                      fill: "#757185",
                    },
                  },
                  "& .MuiChartsGrid-line": {
                    stroke: "#252134",
                  },
                  '& .MuiChartsAxis-tick[data-state="selected"]': {
                    stroke: "white",
                  },
                  // Dark mode tooltip
                  "& .MuiChartsTooltip-root": {
                    backgroundColor: "#121212", // Dark background
                    color: "#fff", // White text
                    borderRadius: "8px",
                    border: "1px solid #333",
                  },
                })}
                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                series={[
                  {
                    data: [2, 5.5, 2, 83.5, 1.5, 5],
                    color: "#7b9f80",
                  },
                ]}
                grid={{ vertical: true, horizontal: true }}
              />
            </div>
          </div>
          <div className="flex items-center h-16 border-t border-n-6 bg-n-8"></div>
        </div>
      </div>
    </div>
  );
};

export default DeviceMenuMaxLgUI;
