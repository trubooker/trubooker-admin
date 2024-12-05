"use client";

import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import { io } from "socket.io-client";

interface BusStop {
  latitude: number;
  longitude: number;
  name: string;
}

interface MapComponentProps {
  busStops: BusStop[];
}

const MapComponent = ({ busStops }: MapComponentProps) => {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 9.07226,
    lng: 7.49508,
  });
  const [directionsResponse, setDirectionsResponse] = useState<any>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  // Uncomment when the updated versions with drivers new position is being sent back from the backend

  useEffect(() => {
    const socket = io(); // Connect to the server

    // Listen for real-time driver location updates
    socket.on(
      "driverLocation",
      (newLocation: { latitude: number; longitude: number }) => {
        setCurrentLocation({
          lat: newLocation.latitude,
          lng: newLocation.longitude,
        });
      }
    );

    // Cleanup when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [currentLocation]);

  useEffect(() => {
    if (isLoaded && busStops.length > 1) {
      const directionsService = new window.google.maps.DirectionsService();

      const waypoints = busStops.slice(1, -1).map((stop) => ({
        location: { lat: stop.latitude, lng: stop.longitude },
        stopover: true,
      }));

      directionsService.route(
        {
          origin: { lat: busStops[0].latitude, lng: busStops[0].longitude },
          destination: {
            lat: busStops[busStops.length - 1].latitude,
            lng: busStops[busStops.length - 1].longitude,
          },
          waypoints: waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    }
  }, [isLoaded, busStops]);

  if (!isLoaded) return <div>Loading...</div>;

  const markerIcon = {
    url: "/location.svg",
    scaledSize: new google.maps.Size(40, 40),
  };

  const driverIcon = {
    url: "/car.svg",
    scaledSize: new google.maps.Size(40, 40),
  };

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <GoogleMap
        center={currentLocation}
        zoom={13}
        mapContainerStyle={{ height: "100%", width: "100%" }}
        options={{
          zoomControl: true, // Show zoom controls
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER, // Position of zoom controls
          },
          mapTypeControl: false, // Show map type controls (satellite/map)
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU, // Set control style
            position: google.maps.ControlPosition.TOP_LEFT, // Position of map type controls
          },
          streetViewControl: false, // Hide street view control
          fullscreenControl: true, // Hide fullscreen control
        }}
      >
        {/* Driver Marker */}
        <Marker position={currentLocation} icon={driverIcon} />

        {/* Directions Renderer */}
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}

        {/* Bus Stops */}
        {busStops.map((stop, index) => (
          <Marker
            key={index}
            position={{ lat: stop.latitude, lng: stop.longitude }}
            icon={markerIcon}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
