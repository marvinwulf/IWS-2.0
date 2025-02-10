import React, { useState, useCallback, useRef } from "react";

const Fader = ({
  minValue,
  maxValue,
  initialValue,
  settingName,
  bgColor,
  fgColor,
  dotColor,
  onFaderChange,
  onValueChange,
  type,
  deviceDataItem,
  lockThreshold,
}) => {
  const [value, setValue] = useState(initialValue);
  const sliderRef = useRef(null);

  const updateValue = useCallback(
    (newValue) => {
      const clampedValue = Math.min(lockThreshold ?? maxValue, Math.max(minValue, newValue));
      setValue(clampedValue);

      // Notify the parent component
      if (onValueChange) {
        onValueChange(clampedValue);
      }
    },
    [minValue, maxValue, lockThreshold, onValueChange]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      let newValue = ((e.clientX - rect.left) / rect.width) * (maxValue - minValue) + minValue;

      updateValue(newValue);
    },
    [minValue, maxValue, updateValue]
  );

  const handleMouseDown = () => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleClick = (e) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let newValue = ((e.clientX - rect.left) / rect.width) * (maxValue - minValue) + minValue;

    // Snap to `lockThreshold` if it exceeds
    if (lockThreshold !== undefined && newValue > lockThreshold) {
      newValue = lockThreshold;
    }

    updateValue(newValue);
    onFaderChange(deviceDataItem, Math.round(newValue));
  };

  const formatValue = (val) => {
    if (type === "percent") return `${Math.round(val)} %`;
    if (type === "volume")
      return val < 950 ? `${Math.round(val / 50) * 50} mL` : `${(Math.round(val / 100) / 10).toFixed(1)} L`;
    return val;
  };

  return (
    <div className="relative w-full">
      <div
        ref={sliderRef}
        className="relative w-full h-2.5 cursor-pointer"
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <div
          className={`absolute top-0 left-0 h-full ${fgColor} rounded-l-full`}
          style={{ width: `${((value - minValue) / (maxValue - minValue)) * 100}%` }}
        />
        <div
          className={`absolute top-0 right-0 h-full ${bgColor} rounded-r-full`}
          style={{ width: `${(1 - (value - minValue) / (maxValue - minValue)) * 100}%` }}
        />
        <div className="relative mx-[5px]">
          <div
            className={`absolute top-[5px] left-0 aspect-square h-4 rounded-full border-n-7 border-2 ${dotColor} transform -translate-x-1/2 -translate-y-1/2`}
            style={{ left: `${((value - minValue) / (maxValue - minValue)) * 100}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between items-center relative top-2 w-full text-sm mb-2">
        <p>{settingName}</p>
        <input
          type="text"
          value={formatValue(value)}
          disabled={true}
          className="w-16 border border-n-6 rounded-md text-center outline-none bg-[#0e0c15]"
        />
      </div>
    </div>
  );
};

export default Fader;
