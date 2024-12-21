import React, { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from "@react-google-maps/api";
import io from "socket.io-client";

// Map container styles
const containerStyle = {
  width: "100%",
  height: "100vh",
};

// Initial center of the map
const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

const MapComponent = () => {
  // State variables
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [driverLocation, setDriverLocation] = useState<google.maps.LatLngLiteral>(defaultCenter);
  const [endLocation, setEndLocation] = useState<google.maps.LatLngLiteral>({
    lat: 37.8044,
    lng: -122.2711,
  });
  const [busStops, setBusStops] = useState<google.maps.LatLngLiteral[]>([
    { lat: 37.7793, lng: -122.4192 },
    { lat: 37.7848, lng: -122.4016 },
  ]);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [eta, setEta] = useState<string | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [roadName, setRoadName] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Load Google Maps script
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  // Smooth marker movement
  const smoothMarkerMove = (current: google.maps.LatLngLiteral, next: google.maps.LatLngLiteral, duration = 1000) => {
    const start = new google.maps.LatLng(current);
    const end = new google.maps.LatLng(next);
    const deltaLat = end.lat() - start.lat();
    const deltaLng = end.lng() - start.lng();
    const steps = 30; // Adjust for smoother or quicker movement
    const interval = duration / steps;

    let currentStep = 0;
    const moveMarker = () => {
      if (currentStep < steps) {
        const lat = start.lat() + (deltaLat * currentStep) / steps;
        const lng = start.lng() + (deltaLng * currentStep) / steps;
        setDriverLocation({ lat, lng });
        currentStep++;
        setTimeout(moveMarker, interval);
      }
    };
    moveMarker();
  };

  // Calculate the route
  const calculateRoute = useCallback(async () => {
    try {
      const directionsService = new google.maps.DirectionsService();
      const result = await directionsService.route({
        origin: driverLocation,
        destination: endLocation,
        waypoints: busStops.map((stop) => ({
          location: new google.maps.LatLng(stop.lat, stop.lng),
        })),
        travelMode: google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(result);
    } catch (error) {
      console.error("Error calculating route:", error);
      alert("Failed to calculate route. Please check your network or map configuration.");
    }
  }, [driverLocation, endLocation, busStops]);

  // Calculate ETA and Distance
  const calculateETA = useCallback(() => {
    if (!currentLocation || !endLocation) return;

    const distanceService = new google.maps.DistanceMatrixService();
    distanceService.getDistanceMatrix(
      {
        origins: [currentLocation],
        destinations: [endLocation],
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK" && response.rows[0].elements[0].status === "OK") {
          setEta(response.rows[0].elements[0].duration.text);
          setDistance(response.rows[0].elements[0].distance.text);
        } else {
          console.error("Failed to calculate ETA:", status);
        }
      }
    );
  }, [currentLocation, endLocation]);

  // Fetch road name
  const fetchRoadName = useCallback((location: google.maps.LatLngLiteral) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === "OK" && results[0]) {
        setRoadName(results[0].formatted_address);
      } else {
        console.error("Geocoding failed:", status);
      }
    });
  }, []);

  // Socket.io connection
  useEffect(() => {
    const socket = io();

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("driverLocationUpdate", (location: google.maps.LatLngLiteral) => {
      setCurrentLocation(location);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      alert("Connection lost. Reconnecting...");
    });

    socket.on("disconnect", () => {
      console.warn("Socket disconnected. Retrying...");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Update driver location smoothly and calculate route/ETA
  useEffect(() => {
    if (currentLocation) {
      smoothMarkerMove(driverLocation, currentLocation);
      calculateETA();
      fetchRoadName(currentLocation);
    }
  }, [currentLocation]);

  // Automatically calculate route when dependencies change
  useEffect(() => {
    if (isLoaded) calculateRoute();
  }, [isLoaded, calculateRoute]);

  // Fit map bounds to include all points
  const fitBounds = useCallback(() => {
    if (mapRef.current && directionsResponse) {
      const bounds = new google.maps.LatLngBounds();
      busStops.forEach((stop) => bounds.extend(new google.maps.LatLng(stop.lat, stop.lng)));
      bounds.extend(driverLocation);
      bounds.extend(endLocation);
      mapRef.current.fitBounds(bounds);
    }
  }, [busStops, driverLocation, endLocation, directionsResponse]);

  useEffect(() => {
    if (isLoaded && mapRef.current) fitBounds();
  }, [isLoaded, fitBounds]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={driverLocation}
        zoom={14}
        onLoad={(map) => (mapRef.current = map)}
      >
        {currentLocation && <Marker position={driverLocation} />}
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>

      {/* Floating ETA and Distance */}
      <div className="absolute top-4 left-4 bg-white p-3 rounded shadow">
        {eta && <p>ETA: {eta}</p>}
        {distance && <p>Distance: {distance}</p>}
      </div>

      {/* Floating Road Name */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow">
        {roadName && <p>Current Location: {roadName}</p>}
      </div>
    </div>
  );
};

export default MapComponent;
