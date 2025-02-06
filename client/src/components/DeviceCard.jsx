import Icon from "@mdi/react";

import {
  mdiBattery10,
  mdiBattery20,
  mdiBattery30,
  mdiBattery40,
  mdiBattery50,
  mdiBattery60,
  mdiBattery70,
  mdiBattery80,
  mdiBattery90,
  mdiBattery,
  mdiBatteryRemoveOutline,
} from "@mdi/js";

const DeviceCard = ({ device, onClick }) => {
  const getWlIndicatorColors = (tankLevel, barIndex) => {
    const colors = {
      0: ["bg-red-600 blink2", "bg-amber-500", "bg-green-500"],
      1: ["bg-n-6", "bg-amber-500", "bg-green-500"],
      2: ["bg-n-6", "bg-n-6", "bg-green-500"],
    };
    return colors[barIndex][tankLevel] || "bg-gray-500";
  };

  const getBatteryIcon = (batLevel, type) => {
    if (type === "icon") {
      switch (true) {
        case batLevel === null:
          return mdiBatteryRemoveOutline;
        case batLevel <= 10:
          return mdiBattery10;
        case batLevel <= 20:
          return mdiBattery20;
        case batLevel <= 30:
          return mdiBattery30;
        case batLevel <= 40:
          return mdiBattery40;
        case batLevel <= 50:
          return mdiBattery50;
        case batLevel <= 60:
          return mdiBattery60;
        case batLevel <= 70:
          return mdiBattery70;
        case batLevel <= 80:
          return mdiBattery80;
        case batLevel <= 90:
          return mdiBattery90;
        case batLevel <= 100:
          return mdiBattery;
        default:
          return mdiBatteryUnknown;
      }
    } else if (type === "class") {
      switch (true) {
        case batLevel === null:
          return `text-amber-500`;
        case batLevel <= 5:
          return `text-red-600 blink`;
        default:
          return `text-n-5 hover:opacity-70 tr`;
      }
    }
  };

  return (
    <div
      className="w-38 lg:w-56 flex-col border border-n-6 rounded-md overflow-hidden cursor-pointer shadow-lg hover:scale-105 tr"
      onClick={onClick}
    >
      <div className="border-b border-n-6 bg-n-7 h-[48px]">
        <div className="relative flex items-center h-full pl-3 lg:px-4 py-3 gap-3 -mb-0.5">
          <div
            className={`top-0 aspect-square h-[6px] lg:h-[8px] rounded-lg ${
              device.isActive === 1 ? "bg-green-400" : "bg-red-500"
            }`}
          ></div>
          <div
            className={`absolute left-[9px] lg:left-3 aspect-square h-[12px] lg:h-[16px] rounded-lg ${
              device.isActive === 1 ? "bg-green-400/20" : "bg-red-500/20"
            }`}
          ></div>

          <p
            className={`whitespace-nowrap overflow-x-clip overflow-ellipsis w-full max-lg:text-sm lg:-mb-0.25 pr-6 lg:pr-12 ${
              device.isActive === 1 ? "text-n-1" : "text-n-10"
            }`}
            title={device.name}
          >
            {device.name}
          </p>

          <div className="absolute -right-0.5 lg:right-0 -bottom-[10px] lg:-bottom-[7.5px]">
            <Icon
              path={getBatteryIcon(device.batLevel, "icon")}
              className={`h-5 lg:h-6 absolute right-3 ${getBatteryIcon(device.batLevel, "class")}`}
              rotate={90}
            ></Icon>
          </div>
        </div>
      </div>

      <div className="flex my-[15px] mx-3 lg:mx-4 gap-0.5 h-2 lg:pr-8 mr-10">
        <div className={`hover:opacity-80 tr w-[33%] rounded-l-md ${getWlIndicatorColors(device.tankLevel, 0)}`}></div>
        <div className={`hover:opacity-80 tr w-[33%] ${getWlIndicatorColors(device.tankLevel, 1)}`}></div>
        <div className={`hover:opacity-80 tr w-[33%] rounded-r-md ${getWlIndicatorColors(device.tankLevel, 2)}`}></div>
      </div>
    </div>
  );
};

export default DeviceCard;
