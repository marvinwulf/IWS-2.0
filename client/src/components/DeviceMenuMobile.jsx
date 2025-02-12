import React, { useState, useEffect, useRef } from "react";
import Icon from "@mdi/react";
import { mdiClose, mdiPencil } from "@mdi/js";

import MaxLgDMPage0 from "./MaxLgDMPage0";
import MaxLgDMPage1 from "./MaxLgDMPage1";

const DeviceMenuMaxLgUI = ({
  selectedDeviceData,
  onClose,
  handleFaderChange,
  handleSwitchChange,
  handleNameChange,
}) => {
  const [currentMobilePage, setCurrentMobilePage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState(selectedDeviceData.name);

  const inputRef = useRef(null);

  useEffect(() => {
    setNewName(selectedDeviceData.name); // Update name
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
      {/* Mobile Only Top Bar */}
      <div
        id="top-bar-container"
        className="relative flex items-center justify-center gap-2 h-[72px] w-full border-b border-n-6 pb-2"
      >
        <div className="absolute right-0 top-0 aspect-square h-7 p-0.5 rounded-md transition-all ease-in-out ">
          <Icon
            path={mdiClose}
            className="text-n-4 hover-never:text-n-3 transition-all ease-in-out cursor-pointer"
            onClick={onClose}
          ></Icon>
        </div>

        <div className="flex flex-col items-center">
          <div
            className="flex items-center gap-2 -mb-1 ml-7 hover-never:opacity-75 hover-never:scale-105 transition-all duration-150 ease-in-out cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <p className="text-n-1 font-bold whitespace-nowrap overflow-hidden overflow-ellipsis text-center">
              {selectedDeviceData.name}
            </p>
            <div className="h-5 aspect-square -mt-1">
              <Icon path={mdiPencil} className="text-n-4"></Icon>
            </div>
          </div>
          <p className="text-n-4 text-[12px] text-sm">UID: {selectedDeviceData.UID}</p>
        </div>
      </div>

      <div id="tab-bar" className="h-[40px] flex justify-center w-full my-2 max-w-[480px] mx-auto">
        <div
          className={`flex w-1/2 justify-center items-center text-sm cursor-pointer hover-never:text-n-1 tr p-4 ${
            currentMobilePage === 0 ? "text-n-2" : "text-n-4"
          }`}
          onClick={() => setCurrentMobilePage(0)}
        >
          Optionen
        </div>

        <div className="bg-n-6 h-full w-0.25" />

        <div
          className={`flex w-1/2 justify-center items-center text-sm cursor-pointer hover-never:text-n-1 tr p-4 ${
            currentMobilePage === 1 ? "text-n-2" : "text-n-4"
          }`}
          onClick={() => setCurrentMobilePage(1)}
        >
          Messwerte
        </div>
      </div>

      {currentMobilePage === 0 && (
        <MaxLgDMPage0
          selectedDeviceData={selectedDeviceData}
          handleFaderChange={handleFaderChange}
          handleSwitchChange={handleSwitchChange}
          handleNameChange={handleNameChange}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}

      {currentMobilePage === 1 && (
        <div className="flex-grow">
          <MaxLgDMPage1 selectedDeviceData={selectedDeviceData} />
        </div>
      )}

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
