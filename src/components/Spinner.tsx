import React from "react";
import { FaSpinner } from "react-icons/fa";

const Spinner = () => {
  return (
    <div className="flex justify-center flex-col text-center my-auto h-[500px] w-[60%]">
      <FaSpinner
        className="animate-spin h-full my-auto mx-auto text-gray-500"
        size={24}
      />
    </div>
  );
};

export default Spinner;
