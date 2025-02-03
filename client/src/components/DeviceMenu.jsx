import React, { useState, useEffect } from "react";
import Switch from "./Switch";
import axios from "axios";
import Fader from "./FaderWithDetails";

const DeviceMenu = ({ selectedDeviceData, isVisible, onClose, onUpdateDevice, onError }) => {
  const [deviceData, setDeviceData] = useState(selectedDeviceData);
  const [prevData, setPrevData] = useState(null);

  useEffect(() => {
    setPrevData(deviceData);
    setDeviceData(selectedDeviceData);
  }, [selectedDeviceData]);

  const handleSwitchChange = () => {
    const updatedDeviceData = { ...deviceData, isActive: deviceData.isActive === 1 ? 0 : 1 };
    setDeviceData(updatedDeviceData);

    console.log("%c[EDIT] Device active switch toggled to", "color: cyan", Boolean(updatedDeviceData.isActive));
    onUpdateDevice(updatedDeviceData);
    pushDeviceData(updatedDeviceData);
  };

  const handleFaderChange = (type, value) => {
    const updatedDeviceData = { ...deviceData, [type]: value };
    setDeviceData(updatedDeviceData);

    console.log(`%c[EDIT] ${type}-fader updated to value = ${value}`, "color: cyan");

    onUpdateDevice(updatedDeviceData);
    pushDeviceData(updatedDeviceData);
  };

  const pushDeviceData = async (updatedData) => {
    try {
      const response = await axios.put(`http://localhost:8080/devices/${updatedData.UID}`, {
        name: updatedData.name,
        isActive: updatedData.isActive,
        threshold: updatedData.threshold,
        watervol: updatedData.watervol,
      });

      if (response.status === 200) {
        console.log(
          "%c[API] Pushed edited device data for %c" + updatedData.UID + "%c:",
          "color: #bada55",
          "color: orange",
          "color: #bada55",
          {
            name: updatedData.name,
            isActive: updatedData.isActive,
            threshold: updatedData.threshold,
            watervol: updatedData.watervol,
          }
        );
      } else {
        throw new Error("[API] Failed to update the device status");
      }
    } catch (error) {
      console.error("Error updating device status:", error);
      onError();
      onUpdateDevice(prevData);
      setDeviceData(prevData);
    }
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
      return `${days} ${formatTime(days, "Tag", "Tage")} und ${hours} ${formatTime(hours, "Stunde", "Stunden")}`;
    } else if (hours > 0) {
      return `${hours} ${formatTime(hours, "Stunde", "Stunden")}`;
    } else if (minutes > 0) {
      return `${minutes} ${formatTime(minutes, "Minute", "Minuten")}`;
    } else {
      return `${seconds} ${formatTime(seconds, "Sekunde", "Sekunden")}`;
    }
  };

  const getWlIndicatorColors = (tankLevel, barIndex) => {
    const colors = {
      0: ["bg-red-600 blink2", "bg-amber-500", "bg-green-500"],
      1: ["bg-n-6", "bg-amber-500", "bg-green-500"],
      2: ["bg-n-6", "bg-n-6", "bg-green-500"],
    };
    return colors[barIndex][tankLevel] || "bg-gray-500";
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[49] bg-black bg-opacity-50">
      <div className="flex bg-[#0e0c15] rounded-xl border-n-6 border p-2 h-[80vh]">
        <div className="flex-1 w-[260px]">
          <div className="relative w-full h-[72px] pb-2 flex justify-center items-center">
            <div className="absolute left-3 top-5">
              <Switch id="statusSwitch" checked={deviceData.isActive} onChange={handleSwitchChange} />
            </div>

            <div className="absolute h-8 left-[75px] border-r border-n-5"></div>
            <div className="absolute h-8 right-[75px] border-r border-n-5"></div>

            <p className="text-center text-sm font-300 text-n-4">{deviceData.isActive ? "Aktiv" : "Standby"}</p>
          </div>

          <div className="flex flex-col gap-2">
            {/* Soil Card */}
            <div className="bg-n-7 px-4 py-3 border border-n-6 rounded-md w-full">
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
            <div className="bg-n-7 px-4 py-3 border border-n-6 rounded-md w-full">
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
            <div className="bg-n-7 px-4 py-3 border border-n-6 rounded-md w-full">
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
            {/* Card 4 */}
            <p className="text-sm text-n-4 text-center mt-2">
              {deviceData.timestamp != null
                ? `Zuletzt verbunden vor ${timeDelta(deviceData.timestamp) || "-"} (${deviceData.timestamp} GMT)`
                : "Gerät noch nie verbunden"}
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              onClose();
            }}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceMenu;
