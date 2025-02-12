import React, { useState, useEffect, useRef } from "react";

import Switch from "./Switch";
import Fader from "./FaderWithDetails";

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

const MaxLgDMPage0 = ({ selectedDeviceData, handleSwitchChange, handleFaderChange }) => {
  return (
    <div>
      {/* Bottom Screen */}
      <div id="bottom-screen-container" className="flex-grow flex gap-2">
        <div id="settings-col" className="flex justify-center w-full">
          <div className="flex flex-col gap-2 w-[260px]">
            {/* Switch Card */}
            <div className="bg-n-7 py-3 border border-n-6 rounded-md w-full hover-never:scale-[1.02] transition-all duration-100 ease-in-out">
              <div id="top-bar-left" className="relative h-full w-[260px] flex justify-center items-center">
                <div className="absolute left-3.5">
                  <Switch id="statusSwitchMobile" checked={selectedDeviceData.isActive} onChange={handleSwitchChange} />
                </div>
                <div className="absolute h-8 left-[75px] border-r border-n-5"></div>
                <div className="absolute h-8 right-[75px] border-r border-n-5"></div>
                <p className="text-center text-sm font-300 text-n-4">
                  {selectedDeviceData.isActive ? "Aktiv" : "Standby"}
                </p>
              </div>
            </div>

            {/* Soil Card */}
            <div className="bg-n-7 px-4 py-3 border border-n-6 rounded-md w-full hover-never:scale-[1.02] transition-all duration-100 ease-in-out">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-n-1">Bodenfeuchte</p>
                <input
                  type="text"
                  value={(selectedDeviceData.soilMoisture === null ? "-" : selectedDeviceData.soilMoisture) + " %"}
                  disabled={true}
                  className="w-16 border border-n-6 rounded-md text-center outline-none text-sm bg-[#0e0c15] text-n-1"
                />
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-n-6">
                <div
                  className="h-full overflow-hidden rounded-full bg-green-500"
                  style={{ width: `${selectedDeviceData.soilMoisture || 0}%` }}
                ></div>
              </div>

              <div className="relative h-4">
                <div
                  className="absolute top-[50%] left-0 h-2 w-0.5 rounded-full bg-n-4 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${Math.min(Math.max(1.5, selectedDeviceData.soilMoisture - 1), 98.5)}%`,
                  }}
                />
              </div>
              <Fader
                minValue={0}
                maxValue={100}
                initialValue={selectedDeviceData.threshold || 0}
                settingName="Schwellenwert"
                deviceDataItem="threshold"
                type="percent"
                fgColor="bg-red-700"
                dotColor="bg-n-1"
                bgColor="bg-green-500"
                lockThreshold={50}
                onFaderChange={handleFaderChange}
              />
            </div>

            {/* Water Card */}
            <div className="bg-n-7 px-4 py-3 border border-n-6 rounded-md w-full hover-never:scale-[1.02] transition-all duration-100 ease-in-out">
              <p className="text-sm mb-2">Wasserstand</p>
              <div className="flex gap-0.5 mb-4">
                <div
                  className={`h-2.5 w-[33%] rounded-l-md ${getWlIndicatorColors(selectedDeviceData.tankLevel, 0)}`}
                ></div>
                <div className={`h-2.5 w-[33%]  ${getWlIndicatorColors(selectedDeviceData.tankLevel, 1)}`}></div>
                <div
                  className={`h-2.5 w-[33%] rounded-r-md ${getWlIndicatorColors(selectedDeviceData.tankLevel, 2)}`}
                ></div>
              </div>
              <Fader
                minValue={0}
                maxValue={10000}
                initialValue={selectedDeviceData.waterVol || 0}
                settingName="Pumpvolumen"
                deviceDataItem="waterVol"
                type="volume"
                fgColor="bg-blue-800"
                dotColor="bg-n-1"
                bgColor="bg-n-6"
                onFaderChange={handleFaderChange}
              />
            </div>

            {/* Battery Card */}
            <div className="bg-n-7 px-4 py-3 border border-n-6 rounded-md w-full hover-never:scale-[1.02] transition-all duration-100 ease-in-out">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm">Batterieladung</p>
                <input
                  type="text"
                  value={(selectedDeviceData.batLevel === null ? "-" : selectedDeviceData.batLevel) + " %"}
                  disabled={true}
                  className="w-16 border border-n-6 rounded-md text-center outline-none text-sm bg-[#0e0c15] text-n-1"
                />
              </div>
              <div className="flex-start flex h-2.5 w-full overflow-hidden rounded-full bg-n-6 font-sans text-xs font-medium">
                <div
                  className="flex h-full items-center justify-center overflow-hidden break-all rounded-full bg-green-500 text-n-1"
                  style={{ width: `${selectedDeviceData.batLevel || 0}%` }}
                ></div>
              </div>
            </div>

            {selectedDeviceData.timestamp != null ? (
              <div className="text-sm text-n-4 text-center mt-3 mb-6">
                <p>Zulezt verbunden vor</p>
                <p>{`${timeDelta(selectedDeviceData.timestamp) || "-"}`}</p>
                <p>{`(${selectedDeviceData.timestamp} GMT)`}</p>
              </div>
            ) : (
              <p className="text-sm text-n-4 text-center">Gerät noch nie verbunden</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaxLgDMPage0;
