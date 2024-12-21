import React from "react";
import { PiCaretDoubleDown } from "react-icons/pi";
type BusStop = {
  latitude: number;
  longitude: number;
  name: string;
  time_of_arrival: string;
};

type Station = {
  pick_station: string;
  drop_off_station: string;
  booking_closing_date: string;
  booking_closing_time: string;
  departure_location: string;
  arrival_location: string;
};

type BusStopsProps = {
  stops: BusStop[];
  station: Station;
};

const Timeline: React.FC<BusStopsProps> = ({ stops, station }) => {
  return (
    <div className="w-full ">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col justify-between items-center">
          <div>
            <h4 className="text-gray-900 text-sm font-bold">
              {station?.pick_station || station?.departure_location}
            </h4>
            {/* <p className="text-xs text-gray-500">10:00AM</p> */}
          </div>
          <div className="flex flex-col gap-y-1 items-center">
            <div className="w-px h-3 flex flex-col bg-dashed border-l-2 border-dashed border-orange-400 mt-2"></div>
            {/* <span className="text-orange-400 p-0 m-0">▾</span> */}
            <PiCaretDoubleDown className="text-orange-400 p-0 m-0" />
            <div className="w-px h-3 flex flex-col bg-dashed border-l-2 border-dashed border-orange-400 mb-2"></div>
          </div>
          <div>
            <h4 className="text-gray-900 text-sm flex-wrap font-bold text-right">
              {station?.drop_off_station || station?.arrival_location}
            </h4>
            {/* <p className="text-xs text-gray-500 text-end">12:50PM</p> */}
          </div>
        </div>
      </div>

      {/* Bus Stops Section */}
      <div className="relative">
        {/* Stops */}
        <ul className="pb-5">
          {stops?.map((stop, index) => (
            <li
              key={index}
              className="flex items-start justify-between w-full space-x-4"
            >
              {/* Time */}
              <small className="w-[50%] lg:w-[50px] text-sm text-gray-500">
                {stop?.time_of_arrival}
              </small>

              {/* Line and Dot */}
              <div className="relative flex flex-col items-center">
                {/* Dot */}
                <div
                  className={`w-4 h-4 ${
                    index === 0
                      ? "bg-orange-400 border-orange-400"
                      : "bg-white border-gray-300"
                  } rounded-full border-2`}
                ></div>

                {/* Line Connector */}
                {index < stops?.length - 1 && (
                  <div className="w-[2px] min-h-10 h-12 bg-gray-300"></div>
                )}
              </div>

              {/* Location */}
              <small className="flex-wrap text-xs w-[50%] text-end text-gray-900">
                {stop?.name}
              </small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Timeline;
