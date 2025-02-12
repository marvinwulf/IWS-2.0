import React, { useState } from "react";
import PeriodDeviceDataChartMobile from "./PeriodDeviceDataChartMobile";
import DemoDeviceDataChartMobile from "./DemoDeviceDataChartMobile";

const MaxLgDMPage1 = ({ selectedDeviceData }) => {
  const [chartView, setChartView] = useState(0);

  return (
    <div className="h-full flex flex-col flex-grow rounded-md border border-n-6 bg-n-7 overflow-hidden">
      <div className="flex-grow">
        <div className="relative w-full h-full pb-2">
          {chartView === 0 && (
            <DemoDeviceDataChartMobile
              UIDParam={selectedDeviceData.UID}
              threshold={selectedDeviceData.threshold}
              isActive={selectedDeviceData.isActive}
            />
          )}
          {chartView === 1 && (
            <PeriodDeviceDataChartMobile
              UIDParam={selectedDeviceData.UID}
              threshold={selectedDeviceData.threshold}
              days={28}
            />
          )}
          {chartView === 2 && (
            <PeriodDeviceDataChartMobile
              UIDParam={selectedDeviceData.UID}
              threshold={selectedDeviceData.threshold}
              days={90}
            />
          )}
          {chartView === 3 && (
            <PeriodDeviceDataChartMobile
              UIDParam={selectedDeviceData.UID}
              threshold={selectedDeviceData.threshold}
              days={365}
            />
          )}
        </div>
      </div>
      <div className="flex items-center h-16 border-t border-n-6 bg-n-8 px-6 gap-2">
        <div className="text-[12px] leading-4 text-n-4 py-1 rounded-lg">Chart-Ansicht:</div>
        {[
          { label: "Demo", view: 0 },
          { label: "4W", view: 1 },
          { label: "3M", view: 2 },
          { label: "1J", view: 3 },
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
  );
};

export default MaxLgDMPage1;
