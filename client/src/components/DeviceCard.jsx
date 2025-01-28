import { Tooltip } from "@material-tailwind/react";
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

const DeviceCard = (item, onClick) => {
  console.log(item);
  const getWlIndicatorColors = (tankLevel, barIndex) => {
    console.log(tankLevel, barIndex);
    const colors = {
      0: ["bg-red-600 blink2", "bg-amber-500", "bg-green-500"],
      1: ["bg-n-5", "bg-amber-500", "bg-green-500"],
      2: ["bg-n-5", "bg-n-5", "bg-green-500"],
    };
    return colors[barIndex][tankLevel];
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
      className="w-44 lg:w-56 flex-col border border-n-6 rounded-md overflow-hidden cursor-pointer shadow-lg hover:scale-105 tr"
      onClick={onClick}
    >
      <div className="border-b border-n-6 bg-n-7 h-[48px]">
        <div className="relative flex items-center px-4 py-3 gap-3 -mb-0.5">
          <div
            className={`aspect-square h-[8px] rounded-lg ${item.device.isActive === 1 ? "bg-green-400" : "bg-red-500"}`}
          ></div>
          <div
            className={`absolute left-3 aspect-square h-[16px] rounded-lg ${
              item.device.isActive === 1 ? "bg-green-400/20" : "bg-red-500/20"
            }`}
          ></div>
          <p
            className={`whitespace-nowrap overflow-x-clip overflow-ellipsis w-full pr-12 ${
              item.device.isActive === 1 ? "text-n-1" : "text-n-10"
            }`}
            title={item.device.name}
          >
            {item.device.name}
          </p>

          <Icon
            path={getBatteryIcon(item.device.batLevel, "icon")}
            className={`absolute right-3 ${getBatteryIcon(item.device.batLevel, "class")}`}
            size={1}
            rotate={90}
          ></Icon>
        </div>
      </div>

      <div className="flex my-4 mx-4 gap-0.5 h-2">
        <div
          className={`hover:opacity-80 tr w-[33%] rounded-l-md ${getWlIndicatorColors(item.device.tankLevel, 0)}`}
        ></div>
        <div className={`hover:opacity-80 tr w-[33%] ${getWlIndicatorColors(item.device.tankLevel, 1)}`}></div>
        <div
          className={`hover:opacity-80 tr w-[33%] rounded-r-md ${getWlIndicatorColors(item.device.tankLevel, 2)}`}
        ></div>
      </div>
    </div>
  );
};

export default DeviceCard;
