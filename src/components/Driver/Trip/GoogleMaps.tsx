"use client";

import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import { io } from "socket.io-client";
import BouncingBall from "@/components/BounceXanimation";

type Coord = {
  latitude: string;
  longitude: string;
};

interface BusStop {
  name: string;
  time_of_arrival: string;
}

interface MapComponentProps {
  busStops: BusStop[];
  busstop_latlong: Coord[];
  departure?: Coord;
  arrival?: Coord;
}

const MapComponent = ({
  busStops,
  busstop_latlong,
  departure,
  arrival,
}: MapComponentProps) => {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 0,
    lng: 0,
  });

  const [directionsResponse, setDirectionsResponse] = useState<any>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API || "",
    libraries: ["places"],
  });

  // Set initial map location when departure becomes available
  useEffect(() => {
    if (departure?.latitude && departure?.longitude) {
      setCurrentLocation({
        lat: Number(departure.latitude),
        lng: Number(departure.longitude),
      });
    }
  }, [departure]);

  // Socket listener
  useEffect(() => {
    const socket = io();

    socket.on(
      "driverLocation",
      (newLocation: { latitude: number; longitude: number }) => {
        setCurrentLocation({
          lat: Number(newLocation?.latitude ?? 0),
          lng: Number(newLocation?.longitude ?? 0),
        });
      }
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  // Load directions
  useEffect(() => {
    if (
      !isLoaded ||
      !departure ||
      !arrival ||
      !departure.latitude ||
      !departure.longitude ||
      !arrival.latitude ||
      !arrival.longitude
    ) {
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    const waypoints =
      busstop_latlong?.slice(1, -1).map((stop) => ({
        location: {
          lat: Number(stop?.latitude ?? 0),
          lng: Number(stop?.longitude ?? 0),
        },
        stopover: true,
      })) || [];

    directionsService.route(
      {
        origin: {
          lat: Number(departure.latitude),
          lng: Number(departure.longitude),
        },
        destination: {
          lat: Number(arrival.latitude),
          lng: Number(arrival.longitude),
        },
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
        } else {
          console.error("Error fetching directions:", status);
        }
      }
    );
  }, [isLoaded, departure, arrival, busstop_latlong]);

  if (!isLoaded) {
    return (
      <div className="relative h-[500px] w-full border rounded-md p-4 justify-center text-center text-lg my-auto flex flex-col">
        <div className="absolute inset-y-0 left-40 flex gap-x-3 italic items-center">
          Map loading <BouncingBall />
        </div>
      </div>
    );
  }

  // Wait until coordinates are available
  if (!departure || !arrival) {
    return (
      <div className="h-[500px] w-full border rounded-md flex items-center justify-center">
        Loading trip location...
      </div>
    );
  }

  const driverIcon = {
    url: "/car.svg",
    scaledSize: new google.maps.Size(80, 80),
  };

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <GoogleMap
        center={currentLocation}
        zoom={13}
        mapContainerStyle={{ height: "100%", width: "100%" }}
        options={{
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER,
          },
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        <Marker position={currentLocation} icon={driverIcon} />

        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}

        {busstop_latlong?.map((stop, index) => (
          <Marker
            key={index}
            position={{
              lat: Number(stop?.latitude ?? 0),
              lng: Number(stop?.longitude ?? 0),
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   GoogleMap,
//   Marker,
//   DirectionsRenderer,
//   useJsApiLoader,
// } from "@react-google-maps/api";
// import { io } from "socket.io-client";
// import BouncingBall from "@/components/BounceXanimation";

// type Coord = {
//   latitude: string;
//   longitude: string;
// };
// interface BusStop {
//   name: string;
//   time_of_arrival: string;
// }

// interface MapComponentProps {
//   busStops: BusStop[] | [];
//   busstop_latlong: Coord[] | [];
//   departure: Coord;
//   arrival: Coord;
// }

// const MapComponent = ({
//   busStops,
//   busstop_latlong,
//   departure,
//   arrival,
// }: MapComponentProps) => {
//   const [currentLocation, setCurrentLocation] = useState({
//     lat: Number(departure.latitude ?? 0),
//     lng: Number(departure.longitude ?? 0),
//   });
//   const [directionsResponse, setDirectionsResponse] = useState<any>(null);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API || "",
//     libraries: ["places"],
//   });

//   // Uncomment when the updated versions with drivers new position is being sent back from the backend

//   useEffect(() => {
//     const socket = io(); // Connect to the server

//     // Listen for real-time driver location updates
//     socket.on(
//       "driverLocation",
//       (newLocation: { latitude: number; longitude: number }) => {
//         setCurrentLocation({
//           lat: Number(newLocation.latitude ?? 0),
//           lng: Number(newLocation.longitude ?? 0),
//         });
//       }
//     );

//     // Cleanup when the component unmounts
//     return () => {
//       socket.disconnect();
//     };
//   }, [currentLocation]);

//   useEffect(() => {
//     if (isLoaded && busstop_latlong?.length > 1) {
//       const directionsService = new window.google.maps.DirectionsService();

//       const waypoints = busstop_latlong?.slice(1, -1).map((stop) => ({
//         location: {
//           lat: Number(stop.latitude ?? 0),
//           lng: Number(stop.longitude ?? 0),
//         },
//         stopover: true,
//       }));

//       directionsService.route(
//         {
//           origin: {
//             lat: Number(departure.latitude ?? 0),
//             lng: Number(departure.longitude ?? 0),
//           },
//           destination: {
//             lat: Number(arrival.latitude ?? 0),
//             lng: Number(arrival.longitude ?? 0),
//           },
//           waypoints: waypoints,
//           travelMode: window.google.maps.TravelMode.DRIVING,
//         },
//         (result, status) => {
//           if (status === window.google.maps.DirectionsStatus.OK) {
//             setDirectionsResponse(result);
//           } else {
//             console.error(`Error fetching directions: ${status}`);
//           }
//         }
//       );
//     }
//   }, [isLoaded, busStops, busstop_latlong, departure, arrival]);

//   if (!isLoaded)
//     return (
//       <div className="relative h-[500px] w-full border rounded-md p-4 justify-center text-center text-lg my-auto flex flex-col">
//         <div className="absolute inset-y-0 left-40 flex gap-x-3 italic items-center">
//           Map loading <BouncingBall />
//         </div>
//       </div>
//     );

//   const driverIcon = {
//     url: "/car.svg",
//     scaledSize: new google.maps.Size(80, 80),
//   };

//   return (
//     <div style={{ height: "500px", width: "100%" }}>
//       <GoogleMap
//         center={currentLocation}
//         zoom={13}
//         mapContainerStyle={{ height: "100%", width: "100%" }}
//         options={{
//           zoomControl: true, // Show zoom controls
//           zoomControlOptions: {
//             position: google.maps.ControlPosition.RIGHT_CENTER, // Position of zoom controls
//           },
//           mapTypeControl: false, // Show map type controls (satellite/map)
//           mapTypeControlOptions: {
//             style: google.maps.MapTypeControlStyle.DROPDOWN_MENU, // Set control style
//             position: google.maps.ControlPosition.TOP_LEFT, // Position of map type controls
//           },
//           streetViewControl: false, // Hide street view control
//           fullscreenControl: true, // Hide fullscreen control
//         }}
//       >
//         {/* Driver Marker */}
//         <Marker position={currentLocation} icon={driverIcon} />

//         {/* Directions Renderer */}
//         {directionsResponse && (
//           <DirectionsRenderer directions={directionsResponse} />
//         )}

//         {/* Bus Stops */}
//         {busstop_latlong?.map((stop, index) => (
//           <Marker
//             key={index}
//             position={{
//               lat: Number(stop.latitude ?? 0),
//               lng: Number(stop.longitude ?? 0),
//             }}
//           />
//         ))}
//       </GoogleMap>
//     </div>
//   );
// };

// export default MapComponent;
