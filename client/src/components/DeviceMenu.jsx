import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DeviceMenuLgUI from "./DeviceMenuDesktop";
import DeviceMenuMaxLgUI from "./DeviceMenuMobile";

const DeviceMenu = ({ selectedDeviceDataProp, isVisible, onClose, onUpdateDevice, onError }) => {
  const [selectedDeviceData, setSelectedDeviceData] = useState(selectedDeviceDataProp);
  const [prevData, setPrevData] = useState(null);

  const menuRef = useRef(null);

  useEffect(() => {
    console.log("[DEVICE MENU] Selected Device Prop got updated:", selectedDeviceDataProp);
    setPrevData(selectedDeviceData);
    setSelectedDeviceData(selectedDeviceDataProp);
  }, [selectedDeviceDataProp]);

  const handleNameChange = (newName) => {
    const updatedDeviceData = { ...selectedDeviceData, name: newName };
    setSelectedDeviceData(updatedDeviceData);
    onUpdateDevice(updatedDeviceData);
    pushDeviceData(updatedDeviceData);
  };

  const handleSwitchChange = () => {
    const updatedDeviceData = { ...selectedDeviceData, isActive: selectedDeviceData.isActive === 1 ? 0 : 1 };
    setSelectedDeviceData(updatedDeviceData);

    console.log("[DEVICE MENU] EDIT Device active switch toggled to", Boolean(updatedDeviceData.isActive));
    onUpdateDevice(updatedDeviceData);
    pushDeviceData(updatedDeviceData);
  };

  const handleFaderChange = (type, value) => {
    const updatedDeviceData = { ...selectedDeviceData, [type]: value };
    setSelectedDeviceData(updatedDeviceData);

    console.log(`[DEVICE MENU] EDIT ${type}-fader updated to value = ${value}`);

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
        console.log("[DEVICE MENU] Successfully called API to update data:", {
          UID: updatedData.UID,
          name: updatedData.name,
          isActive: updatedData.isActive,
          threshold: updatedData.threshold,
          waterVol: updatedData.waterVol,
        });
      } else {
        throw new Error("[DEVICE MENU] Failed to update the device data");
      }
    } catch (error) {
      console.error("[DEVICE MENU] Error calling API, reverting data.", error);
      onError();
      onUpdateDevice(prevData);
      setSelectedDeviceData(prevData);
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
              deviceData={selectedDeviceData}
              onClose={onClose}
              handleFaderChange={handleFaderChange}
              handleSwitchChange={handleSwitchChange}
              handleNameChange={handleNameChange}
            />
          </div>

          <div className="block lg:hidden">
            <DeviceMenuMaxLgUI
              deviceData={selectedDeviceData}
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
