import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DeviceMenuLgUI from "./DeviceMenuDesktop";
import DeviceMenuMaxLgUI from "./DeviceMenuMobile";

const DeviceMenu = ({ selectedDeviceData, isVisible, onClose, onUpdateDevice, onError }) => {
  const [deviceData, setDeviceData] = useState(selectedDeviceData);
  const [prevData, setPrevData] = useState(null);

  const menuRef = useRef(null);

  useEffect(() => {
    setPrevData(deviceData);
    setDeviceData(selectedDeviceData);
  }, [selectedDeviceData]);

  const handleNameChange = (newName) => {
    const updatedDeviceData = { ...deviceData, name: newName };
    setDeviceData(updatedDeviceData);
    onUpdateDevice(updatedDeviceData);
    pushDeviceData(updatedDeviceData);
  };

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
      const response = await axios.put(`http://192.168.178.29:8080/devices/${updatedData.UID}`, {
        name: updatedData.name,
        isActive: updatedData.isActive,
        threshold: updatedData.threshold,
        waterVol: updatedData.waterVol,
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
            waterVol: updatedData.waterVol,
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[49] bg-black bg-opacity-50">
      <div ref={menuRef} className="p-2 rounded-xl bg-[#0e0c15] border border-n-6 overflow-scroll z-[49]">
        <div
          id="main-window"
          className="flex flex-col h-[76vh] w-[80vw] md:w-[90vw] xl:w-[70vw] max-w-[1200px] max-h-[720px]"
        >
          <div className="hidden lg:block flex-grow">
            <DeviceMenuLgUI
              deviceData={deviceData}
              onClose={onClose}
              handleFaderChange={handleFaderChange}
              handleSwitchChange={handleSwitchChange}
              handleNameChange={handleNameChange}
            />
          </div>

          <div className="block lg:hidden">
            <DeviceMenuMaxLgUI
              deviceData={deviceData}
              onClose={onClose}
              handleFaderChange={handleFaderChange}
              handleSwitchChange={handleSwitchChange}
              handleNameChange={handleNameChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceMenu;
