"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import polyline from "polyline-encoded";

interface ActivityMapProps {
  polyline: string;
  className?: string;
}

export function ActivityMap({
  polyline: polylineStr,
  className = "",
}: ActivityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Decode the polyline to get array of [lat, lng] coordinates
    const coordinates = polyline.decode(polylineStr);

    if (coordinates.length === 0) return;

    // If map doesn't exist, create it
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: false, // Disable zoom controls
        dragging: false, // Disable panning
        scrollWheelZoom: false, // Disable zoom with mouse wheel
      });

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Create a polyline and add it to the map
    const path = L.polyline(coordinates, {
      color: "#FC4C02", // Strava orange
      weight: 3,
    }).addTo(map);

    // Fit the map to the polyline bounds with some padding
    map.fitBounds(path.getBounds(), {
      padding: [20, 20],
    });

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [polylineStr]);

  return <div ref={mapRef} className={`h-[200px] ${className}`} />;
}
