"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";
import { io, Socket } from "socket.io-client";

// Dynamically import the `MapContainer` from `react-leaflet` to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

interface BusStop {
  latitude: number;
  longitude: number;
  name: string;
}

interface MapComponentProps {
  busStops: BusStop[];
}

const MapComponent = ({ busStops }: MapComponentProps) => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 9.07226,
    longitude: 7.49508,
  });

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io("http://localhost:3000/api/socket");
    setSocket(socket);

    // Listen for "driverLocation" events from the server
    socket.on(
      "driverLocation",
      (data: { latitude: number; longitude: number }) => {
        setLocation({ latitude: data.latitude, longitude: data.longitude });
      }
    );

    // Clean up the socket connection when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, []);

  const MapUpdater = ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    const map = useMap();
    useEffect(() => {
      map.flyTo([latitude, longitude], map.getZoom());
    }, [latitude, longitude, map]);
    return null;
  };

  const driverIcon = new L.Icon({
    iconUrl: "/car.svg", // Replace this with the actual path or URL to the image
    iconSize: [100, 100], // Adjust the size of the icon
    iconAnchor: [16, 32], // Anchor the icon at the bottom
    popupAnchor: [0, -32], // Adjust the popup position
  });

  const stopIcon = new L.Icon({
    iconUrl: "/location.svg", // Replace this with the actual path or URL to the image
    iconSize: [32, 32], // Adjust the size of the icon
    iconAnchor: [16, 32], // Anchor the icon at the bottom
    popupAnchor: [0, -32], // Adjust the popup position
  });

  // Route polyline (connect the bus stops)

  const busRoute: LatLngExpression[] = busStops.map(
    (stop) => [stop.latitude, stop.longitude] as LatLngExpression
  );
  return (
    <div style={{ height: "500px", width: "100%", backgroundColor: "#1c1c1c" }}>
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={13}
        style={{ height: "100%", width: "100%", zIndex: "0" }}
      >
        <MapUpdater
          latitude={location.latitude}
          longitude={location.longitude}
        />
        ;
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          //   url="https://{s}.basemaps.c/artocdn.com/dark_all/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Draw the route connecting the bus stops */}
        <Polyline positions={busRoute} color="orange" weight={4} />
        {/* Add bus stop markers */}
        {busStops.map((stop: any, index: number) => (
          <Marker
            key={index}
            position={[stop.latitude, stop.longitude]}
            icon={stopIcon}
          >
            <Popup>{stop.name}</Popup>
          </Marker>
        ))}
        <Marker
          position={[location.latitude, location.longitude]}
          icon={driverIcon}
        >
          <Popup>Drivers Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
