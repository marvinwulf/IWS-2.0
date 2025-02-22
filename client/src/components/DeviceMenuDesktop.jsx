import React, { useState, useRef, useEffect } from "react";

import Switch from "./Switch";
import Fader from "./FaderWithDetails";
import DemoDeviceDataChart from "./DemoDeviceDataChart";
import PeriodDeviceDataChart from "./PeriodDeviceDataChart";

import Icon from "@mdi/react";
import { mdiClose, mdiPencil } from "@mdi/js";

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

const DeviceMenuMaxLgUI = ({
  selectedDeviceData,
  onClose,
  handleSwitchChange,
  handleFaderChange,
  handleNameChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState(selectedDeviceData.name);
  const [threshold, setThreshold] = useState(selectedDeviceData.threshold);

  const [chartView, setChartView] = useState(0);

  const inputRef = useRef(null);

  useEffect(() => {
    setNewName(selectedDeviceData.name); // Update name
    setThreshold(selectedDeviceData.threshold); // Update threshold
  }, [selectedDeviceData]);

  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isModalOpen]);

  const handleSave = () => {
    handleNameChange(newName || "Unbenannt");
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setNewName(selectedDeviceData.name); // Reset name if canceled
    setIsModalOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Desktop Top Bar */}
      <div
        id="top-bar-container"
        className="relative flex items-center gap-2 h-[72px] w-full border-b border-n-6 mb-2 pb-2 z-50"
      >
        <div id="top-bar-left" className="relative h-full w-[260px] flex justify-center items-center">
          <div className="absolute left-3">
            <Switch id="statusSwitch" checked={selectedDeviceData.isActive} onChange={handleSwitchChange} />
          </div>
          <div className="absolute h-8 left-[75px] border-r border-n-5"></div>
          <div className="absolute h-8 right-[75px] border-r border-n-5"></div>
          <p className="text-center text-sm font-300 text-n-4">{selectedDeviceData.isActive ? "Aktiv" : "Standby"}</p>
        </div>

        <div id="top-bar-right" className="flex items-center flex-grow h-full">
          <div>
            <div
              className="flex items-center gap-2 -mb-1 hover-never:opacity-75 hover-never:scale-105 transition-all duration-150 ease-in-out cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <p className="text-n-1 text-2xl font-bold whitespace-nowrap max-w-[35vw] overflow-hidden overflow-ellipsis">
                {selectedDeviceData.name}
              </p>
              <div className="h-6 aspect-square -mt-1">
                <Icon path={mdiPencil} className="text-n-4"></Icon>
              </div>
            </div>
            <p className="text-n-4 text-sm">UID: {selectedDeviceData.UID}</p>
          </div>
        </div>

        <div className="absolute right-3 aspect-square h-8 p-0.5 hover-never:bg-n-6 rounded-md transition-all ease-in-out ">
          <Icon
            path={mdiClose}
            className="text-n-4 hover-never:text-n-3 transition-all ease-in-out cursor-pointer"
            onClick={onClose}
          ></Icon>
        </div>
      </div>

      {/* Bottom Screen */}
      <div id="bottom-screen-container" className="flex flex-grow gap-2">
        <div id="settings-col" className="flex justify-center">
          <div className="flex flex-col gap-2 w-[260px]">
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
                initialValue={threshold || 0}
                settingName="Schwellenwert"
                deviceDataItem="threshold"
                type="percent"
                fgColor="bg-red-700"
                dotColor="bg-n-1"
                bgColor="bg-green-500"
                lockThreshold={50}
                onFaderChange={handleFaderChange}
                onValueChange={(newValue) => setThreshold(newValue)}
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
              <div className="text-sm text-n-4 text-center mt-3 mb-5">
                <p>Zulezt verbunden vor</p>
                <p>{`${timeDelta(selectedDeviceData.timestamp) || "-"}`}</p>
                <p>{`(${selectedDeviceData.timestamp} GMT)`}</p>
              </div>
            ) : (
              <p className="text-sm text-n-4 text-center">Gerät noch nie verbunden</p>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-grow rounded-md border border-n-6 bg-n-7 overflow-hidden">
          <div className="flex-grow">
            <div className="relative w-full h-full pb-2">
              {chartView === 0 && (
                <DemoDeviceDataChart
                  UIDParam={selectedDeviceData.UID}
                  threshold={threshold}
                  isActive={selectedDeviceData.isActive}
                />
              )}
              {chartView === 1 && (
                <PeriodDeviceDataChart UIDParam={selectedDeviceData.UID} threshold={threshold} days={28} />
              )}
              {chartView === 2 && (
                <PeriodDeviceDataChart UIDParam={selectedDeviceData.UID} threshold={threshold} days={90} />
              )}
              {chartView === 3 && (
                <PeriodDeviceDataChart UIDParam={selectedDeviceData.UID} threshold={threshold} days={365} />
              )}
            </div>
          </div>
          <div className="flex items-center h-16 border-t border-n-6 bg-n-8 px-6 gap-2">
            <div className="text-sm text-n-4 py-1 px-2 rounded-lg">Chart-Ansicht:</div>
            {[
              { label: "Demo", view: 0 },
              { label: "4 Wochen", view: 1 },
              { label: "3 Monate", view: 2 },
              { label: "1 Jahr", view: 3 },
            ].map(({ label, view }) => (
              <div
                key={view}
                className={`text-sm py-1 px-2 rounded-lg cursor-pointer transition-colors ${
                  chartView === view ? "bg-n-5 text-white" : "bg-n-6 text-gray-400"
                }`}
                onClick={() => setChartView(view)}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-n-7 p-4 rounded-lg shadow-lg w-[300px] border-n-6 border">
            <h2 className="text-n-2 mb-2">Gerätenamen ändern</h2>
            <input
              type="text"
              ref={inputRef}
              value={newName}
              onKeyDown={handleKeyDown}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 border border-n-6 rounded-md bg-[#0e0c15] text-n-1 outline-none pb-[7px]"
              maxLength={16}
            />
            <div className="flex justify-center mt-3 gap-2">
              <button
                className="px-3 py-1 bg-n-6 text-white rounded text-sm hover:bg-n-5 tr"
                onClick={() => setIsModalOpen(false)}
              >
                Abbrechen
              </button>
              <button className="px-3 py-1 bg-n-5 text-white rounded text-sm hover:bg-n-4 tr" onClick={handleSave}>
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceMenuMaxLgUI;
