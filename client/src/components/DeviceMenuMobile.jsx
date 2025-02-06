import React, { useState } from "react";
import Icon from "@mdi/react";
import { mdiClose, mdiPencil } from "@mdi/js";

import MaxLgDMPage0 from "./MaxLgDMPage0";
import MaxLgDMPage1 from "./MaxLgDMPage1";

const DeviceMenuMaxLgUI = ({ deviceData, onClose, handleFaderChange, handleSwitchChange }) => {
  const [currentMobilePage, setCurrentMobilePage] = useState(0);

  return (
    <div>
      {/* Mobile Only Top Bar */}
      <div
        id="top-bar-container"
        className="relative flex items-center justify-center gap-2 h-[72px] w-full border-b border-n-6 pb-2"
      >
        <div className="absolute left-0 top-0 aspect-square h-6 p-0.5 rounded-md transition-all ease-in-out ">
          <Icon
            path={mdiClose}
            className="text-n-4 hover:text-n-3 transition-all ease-in-out cursor-pointer"
            onClick={onClose}
          ></Icon>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 -mb-1 ml-7 hover:opacity-75 hover:scale-105 transition-all duration-150 ease-in-out cursor-pointer">
            <p className="text-n-1 font-bold whitespace-nowrap overflow-hidden overflow-ellipsis text-center">
              {deviceData.name}
            </p>
            <div className="h-5 aspect-square -mt-1">
              <Icon path={mdiPencil} className="text-n-4"></Icon>
            </div>
          </div>
          <p className="text-n-4 text-[12px] text-sm">UID: {deviceData.UID}</p>
        </div>
      </div>

      <div id="tab-bar" className="h-[40px] flex justify-center w-full pt-2 mb-6 max-w-[480px] mx-auto">
        <div
          className={`flex w-1/2 justify-center items-center text-sm cursor-pointer hover:text-n-1 tr ${
            currentMobilePage === 0 ? "text-n-2" : "text-n-4"
          }`}
          onClick={() => setCurrentMobilePage(0)}
        >
          Optionen
        </div>

        <div className="bg-n-6 h-full w-0.25" />

        <div
          className={`flex w-1/2 justify-center items-center text-sm cursor-pointer hover:text-n-1 tr ${
            currentMobilePage === 1 ? "text-n-2" : "text-n-4"
          }`}
          onClick={() => setCurrentMobilePage(1)}
        >
          Messwerte
        </div>
      </div>

      {currentMobilePage === 0 && (
        <MaxLgDMPage0
          deviceData={deviceData}
          handleFaderChange={handleFaderChange}
          handleSwitchChange={handleSwitchChange}
        />
      )}

      {currentMobilePage === 1 && <MaxLgDMPage1 />}
    </div>
  );
};

export default DeviceMenuMaxLgUI;
