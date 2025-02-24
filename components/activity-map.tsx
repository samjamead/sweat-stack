"use client";

import { useEffect, useState } from "react";
import polyline from "polyline-encoded";

interface ActivityMapProps {
  polyline: string;
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

function normalizeCoordinates(coordinates: [number, number][]): Point[] {
  if (coordinates.length === 0) return [];

  // Find the bounds
  let minLat = coordinates[0][0];
  let maxLat = coordinates[0][0];
  let minLng = coordinates[0][1];
  let maxLng = coordinates[0][1];

  coordinates.forEach(([lat, lng]) => {
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  });

  // Calculate scaling factors
  const padding = 20; // Padding in pixels
  const width = 400 - padding * 2; // SVG width minus padding
  const height = 200 - padding * 2; // SVG height minus padding

  const latRange = maxLat - minLat;
  const lngRange = maxLng - minLng;

  // Maintain aspect ratio
  const scale = Math.min(width / (lngRange || 1), height / (latRange || 1));

  // Center the path
  const centerX = (width - lngRange * scale) / 2 + padding;
  const centerY = (height - latRange * scale) / 2 + padding;

  // Convert to SVG coordinates
  return coordinates.map(([lat, lng]) => ({
    x: (lng - minLng) * scale + centerX,
    y: (maxLat - lat) * scale + centerY, // Flip Y axis
  }));
}

function createSvgPath(points: Point[]): string {
  if (points.length === 0) return "";

  const [first, ...rest] = points;
  return (
    `M ${first.x} ${first.y} ` +
    rest.map((point) => `L ${point.x} ${point.y}`).join(" ")
  );
}

export function ActivityMap({
  polyline: polylineStr,
  className = "",
}: ActivityMapProps) {
  const [pathData, setPathData] = useState<string>("");

  useEffect(() => {
    const coordinates = polyline.decode(polylineStr);
    const normalizedPoints = normalizeCoordinates(coordinates);
    const svgPath = createSvgPath(normalizedPoints);
    setPathData(svgPath);
  }, [polylineStr]);

  if (!pathData) return null;

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 400 200"
        className="h-full w-full"
        style={{ background: "#f8f9fa" }}
      >
        {/* Route shadow */}
        <path
          d={pathData}
          stroke="#FC4C02"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.1"
        />
        {/* Main route */}
        <path
          d={pathData}
          stroke="#FC4C02"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Start point */}
        <circle
          cx={pathData.split(" ")[1]}
          cy={pathData.split(" ")[2]}
          r="3"
          fill="#10b981"
        />
        {/* End point */}
        <circle
          cx={pathData.split(" ").slice(-2)[0]}
          cy={pathData.split(" ").slice(-1)[0]}
          r="3"
          fill="#ef4444"
        />
      </svg>
    </div>
  );
}
