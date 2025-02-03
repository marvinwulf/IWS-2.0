import { useState } from "react";

const Switch = ({ id, checked, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    if (onChange) onChange(!isChecked);
  };

  return (
    <label
      htmlFor={id}
      className={`relative flex items-center cursor-pointer w-11 h-6 rounded-full transition-colors 
        ${isChecked ? "bg-green-500" : "bg-n-6"} shadow-inner`}
    >
      <input type="checkbox" id={id} className="sr-only" checked={isChecked} onChange={handleToggle} />
      <span
        className={`absolute left-0.5 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full shadow-md transition-all duration-200 
          ${isChecked ? "translate-x-5 bg-n-6" : "bg-n-5"}`}
      />
    </label>
  );
};

export default Switch;
