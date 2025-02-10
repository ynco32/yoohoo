'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat/dist/leaflet-heat.js';

interface LocationInfo {
  latitude: number;
  longitude: number;
}

interface ProcessedCongestion {
  congestion: number;
}

interface CongestionDisplayProps {
  data: {
    location: LocationInfo;
    congestion: ProcessedCongestion;
  }[];
}

const HeatmapLayer = ({ points }: { points: [number, number, number][] }) => {
  const map = useMap();

  useEffect(() => {
    const heatLayer = L.heatLayer(points, { radius: 25 }).addTo(map);
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
};

export const CongestionDisplay = ({ data }: CongestionDisplayProps) => {
  const heatmapPoints: [number, number, number][] = data.map((item) => [
    item.location.latitude,
    item.location.longitude,
    item.congestion.congestion,
  ]);

  const center: LatLngExpression = [
    data[0].location.latitude,
    data[0].location.longitude,
  ];

  return (
    <div>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <HeatmapLayer points={heatmapPoints} />
      </MapContainer>
      <p>{data[0].location.latitude}</p>
      <p>{data[0].location.longitude}</p>
      <p>{data[1].congestion.congestion}</p>
    </div>
  );
};
