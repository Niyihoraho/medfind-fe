'use client';

import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationPickerProps {
  lat?: number | null;
  lng?: number | null;
  onChange: (lat: number, lng: number) => void;
  className?: string;
  defaultCenter?: [number, number];
}

export function LocationPicker({ lat, lng, onChange, className = 'h-[300px] w-full', defaultCenter = [-1.9441, 30.0619] }: LocationPickerProps) {
  const [mapReady, setMapReady] = useState(false);
  const [modules, setModules] = useState<{ L: any; RL: any } | null>(null);

  useEffect(() => {
    Promise.all([
      import('leaflet'),
      import('react-leaflet'),
      import('leaflet/dist/leaflet.css'),
    ]).then(([L, RL]) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      setModules({ L, RL });
      setMapReady(true);
    });
  }, []);

  if (!mapReady || !modules) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 rounded-md border ${className}`}>
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <MapPin className="w-5 h-5 animate-bounce" />
          <span className="text-sm">Loading map...</span>
        </div>
      </div>
    );
  }

  const { RL } = modules;
  const { MapContainer, TileLayer, Marker, useMapEvents, useMap } = RL;

  const currentPos: [number, number] | null = lat && lng ? [lat, lng] : null;

  function LocationMarker() {
    useMapEvents({
      click(e: any) {
        onChange(e.latlng.lat, e.latlng.lng);
      },
    });

    const map = useMap();
    useEffect(() => {
      if (currentPos) {
        map.setView(currentPos, map.getZoom());
      }
    }, [map]);

    return currentPos === null ? null : <Marker position={currentPos} />;
  }

  return (
    <div className={className}>
      <MapContainer center={currentPos || defaultCenter} zoom={13} className="h-full w-full rounded-md z-0 border">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
      <div className="mt-2 text-xs text-gray-500">
        Click on the map to set the exact coordinates.
        {lat && lng && <span className="ml-2 font-mono text-[var(--med-primary)]">({lat.toFixed(6)}, {lng.toFixed(6)})</span>}
      </div>
    </div>
  );
}
