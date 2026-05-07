'use client';

import { useEffect, useState } from 'react';
import type { Facility } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { MapPin } from 'lucide-react';

interface FacilityMapProps {
  facilities: Facility[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  selectedId?: number | null;
}

export function FacilityMap({ facilities, center = [-1.9441, 30.0619], zoom = 12, className = 'h-[400px] w-full rounded-md border', selectedId }: FacilityMapProps) {
  const [mapReady, setMapReady] = useState(false);
  const [leaflet, setLeaflet] = useState<any>(null);
  const [ReactLeaflet, setReactLeaflet] = useState<any>(null);

  useEffect(() => {
    // Dynamically import both leaflet and react-leaflet on client side only
    Promise.all([
      import('leaflet'),
      import('react-leaflet'),
      import('leaflet/dist/leaflet.css'),
    ]).then(([L, RL]) => {
      // Fix default icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      setLeaflet(L);
      setReactLeaflet(RL);
      setMapReady(true);
    });
  }, []);

  if (!mapReady || !leaflet || !ReactLeaflet) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 ${className}`}>
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <MapPin className="w-6 h-6 animate-bounce" />
          <span className="text-sm">Loading map...</span>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, useMap } = ReactLeaflet;

  const getCustomIcon = (isHighlighted: boolean) => {
    return new leaflet.Icon({
      iconUrl: isHighlighted
        ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
        : 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  };

  const selectedFacility = selectedId ? facilities.find(f => f.id === selectedId) : null;
  const mapCenter: [number, number] = selectedFacility?.latitude && selectedFacility?.longitude
    ? [Number(selectedFacility.latitude), Number(selectedFacility.longitude)]
    : center;

  return (
    <div className={className}>
      <MapContainer center={mapCenter} zoom={selectedId ? 15 : zoom} scrollWheelZoom={true} className="h-full w-full rounded-md z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {facilities.filter(f => f.latitude && f.longitude).map((facility) => (
          <Marker
            key={facility.id}
            position={[Number(facility.latitude), Number(facility.longitude)]}
            icon={getCustomIcon(facility.id === selectedId)}
          >
            <Popup>
              <div className="p-1 min-w-[200px]">
                <h3 className="font-semibold text-sm mb-1">{facility.name}</h3>
                <Badge variant="outline" className="mb-2 capitalize">{facility.type.replace('_', ' ')}</Badge>

                <div className="flex items-start gap-1 text-xs text-gray-600 mb-1">
                  <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>{facility.address || `${facility.location?.sector}, ${facility.location?.district}`}</span>
                </div>

                <a
                  href={`/facilities/${facility.id}`}
                  className="mt-3 block text-center text-xs font-medium text-[var(--med-primary)] hover:underline"
                >
                  View Details
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
