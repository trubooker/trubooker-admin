import React, { useState, useEffect } from "react";

interface TimeInputProps {
  value?: string;
  onChange: (value: string) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ value, onChange }) => {
  const [time, setTime] = useState<string>("00:00 AM");
  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);

  // Update the `time` state when the `value` prop changes
  useEffect(() => {
    if (value) {
      setTime(value);
    }
  }, [value]);

  const handleTimeChange = (
    type: "hours" | "minutes" | "period",
    newValue: string
  ) => {
    const [hours, minutesPeriod] = time.split(":");
    const [minutes, period] = minutesPeriod.split(" ");

    let updatedTime = "";

    switch (type) {
      case "hours":
        updatedTime = `${newValue}:${minutes} ${period}`;
        break;
      case "minutes":
        updatedTime = `${hours}:${newValue} ${period}`;
        break;
      case "period":
        updatedTime = `${hours}:${minutes} ${newValue}`;
        break;
      default:
        updatedTime = time;
    }

    setTime(updatedTime);
    onChange(updatedTime);
  };

  return (
    <div className="flex flex-col gap-0 relative">
      {/* Input Field */}
      <input
        type="text"
        required
        readOnly
        value={time}
        placeholder="00:00 AM"
        className="w-full text-sm text-left text-gray-800 py-2 pl-3 border-none bg-none focus:outline-none focus:ring-none cursor-pointer rounded-lg"
        onClick={() => setIsPickerVisible(!isPickerVisible)}
      />

      {/* Time Picker (Visible on Click) */}
      {isPickerVisible && (
        <div className="flex items-center justify-center gap-2 p-2 bg-gray-100 rounded-lg shadow-md absolute bottom-[-3rem] left-0">
          {/* Hours Input */}
          <select
            value={time?.split(":")[0]}
            onChange={(e) => handleTimeChange("hours", e.target.value)}
            className="text-sm font-medium text-center px-2 py-2 border rounded-md bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500">
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={(i + 1).toString().padStart(2, "0")}>
                {(i + 1).toString().padStart(2, "0")}
              </option>
            ))}
          </select>

          <span className="text-xl font-medium">:</span>

          {/* Minutes Input */}
          <select
            value={time?.split(":")[1]?.split(" ")[0]}
            onChange={(e) => handleTimeChange("minutes", e.target.value)}
            className="text-sm font-medium text-center px-2 py-2 border rounded-md bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500">
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i.toString().padStart(2, "0")}>
                {i.toString().padStart(2, "0")}
              </option>
            ))}
          </select>

          {/* AM/PM Selector */}
          <select
            value={time?.split(" ")[1]}
            onChange={(e) => handleTimeChange("period", e.target.value)}
            className="text-sm font-medium text-center px-1 py-2 border rounded-md bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500">
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default TimeInput;
