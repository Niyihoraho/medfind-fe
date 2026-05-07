'use client';

import { useProvinces, useDistricts, useSectors, useServices, useInsuranceSchemes } from '@/lib/hooks';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { FacilitySearchParams } from '@/types';
import { Search, MapPin, SlidersHorizontal, Navigation2 } from 'lucide-react';
import { useState } from 'react';

interface FacilityFiltersProps {
  filters: FacilitySearchParams;
  onChange: (newFilters: Partial<FacilitySearchParams>) => void;
  onSearch: () => void;
}

export function FacilityFilters({ filters, onChange, onSearch }: FacilityFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Data hooks
  const { data: provinces } = useProvinces();
  const { data: districts } = useDistricts(filters.province_id);
  const { data: sectors } = useSectors(filters.district_id);
  const { data: services } = useServices();
  const { data: insurances } = useInsuranceSchemes();

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onChange({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            sort: 'distance', // Auto-switch to distance sort if GPS is enabled
          });
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Could not get your location. Please check browser permissions or use the manual location selectors.");
          setIsGettingLocation(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsGettingLocation(false);
    }
  };

  const handleClearLocation = () => {
    onChange({ lat: undefined, lng: undefined, sort: 'name' });
  };

  return (
    <div className="bg-white rounded-[14px] border border-[rgba(76,118,59,0.15)] shadow-sm p-5">
      {/* Search Bar & GPS */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search facilities by name..." 
            className="pl-9"
            value={filters.search || ''}
            onChange={(e) => onChange({ search: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
        </div>
        <div className="flex gap-2">
          {filters.lat && filters.lng ? (
            <Button variant="outline" onClick={handleClearLocation} className="shrink-0 text-red-600 hover:text-red-700 border-red-200">
              Clear GPS
            </Button>
          ) : (
            <Button variant="outline" onClick={handleGetLocation} isLoading={isGettingLocation} className="shrink-0 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
              <Navigation2 className="w-4 h-4 mr-2" />
              Use My Location
            </Button>
          )}
          <Button onClick={onSearch} className="btn-vibrant shrink-0 px-10 bg-[var(--med-primary)] text-white hover:bg-[var(--med-deep)] shadow-md">
            Search
          </Button>
        </div>
      </div>

      {/* Primary Filters (Always visible) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Select
          value={filters.service_id || ''}
          onChange={(e) => onChange({ service_id: e.target.value ? Number(e.target.value) : undefined })}
          options={[
            { value: '', label: 'All Services' },
            ...(services?.map(s => ({ value: s.id, label: s.name })) || [])
          ]}
        />
        <Select
          value={filters.insurance_id || ''}
          onChange={(e) => onChange({ insurance_id: e.target.value ? Number(e.target.value) : undefined })}
          options={[
            { value: '', label: 'All Insurances' },
            ...(insurances?.map(i => ({ value: i.id, label: `${i.name} (${i.type})` })) || [])
          ]}
        />
        <Select
          value={filters.type || ''}
          onChange={(e) => onChange({ type: e.target.value as any || undefined })}
          options={[
            { value: '', label: 'All Facility Types' },
            { value: 'hospital', label: 'Hospital' },
            { value: 'health_center', label: 'Health Center' },
            { value: 'clinic', label: 'Clinic' },
            { value: 'dispensary', label: 'Dispensary' },
            { value: 'polyclinic', label: 'Polyclinic' }
          ]}
        />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-gray-500 hover:text-[var(--med-primary)] -ml-2"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          {showAdvanced ? 'Hide Location Filters' : 'Manual Location Filters'}
        </Button>
        
        <Select
          className="w-[200px] h-8 text-xs border-transparent bg-gray-50"
          value={filters.sort || 'name'}
          onChange={(e) => onChange({ sort: e.target.value as 'distance' | 'name' })}
          options={[
            { value: 'name', label: 'Sort by Name' },
            { value: 'distance', label: 'Sort by Distance' }
          ]}
        />
      </div>

      {/* Advanced / Manual Location Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100 bg-gray-50 -mx-5 px-5 pb-1 rounded-b-[14px]">
          <div>
            <label className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1.5"><MapPin className="w-3 h-3"/> Province</label>
            <Select
              value={filters.province_id || ''}
              onChange={(e) => onChange({ 
                province_id: e.target.value ? Number(e.target.value) : undefined,
                district_id: undefined, // Reset children
                sector_id: undefined
              })}
              options={[
                { value: '', label: 'All Provinces' },
                ...(provinces?.map(p => ({ value: p.id, label: p.name })) || [])
              ]}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1.5"><MapPin className="w-3 h-3"/> District</label>
            <Select
              disabled={!filters.province_id}
              value={filters.district_id || ''}
              onChange={(e) => onChange({ 
                district_id: e.target.value ? Number(e.target.value) : undefined,
                sector_id: undefined
              })}
              options={[
                { value: '', label: 'All Districts' },
                ...(districts?.map(d => ({ value: d.id, label: d.name })) || [])
              ]}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1.5"><MapPin className="w-3 h-3"/> Sector</label>
            <Select
              disabled={!filters.district_id}
              value={filters.sector_id || ''}
              onChange={(e) => onChange({ sector_id: e.target.value ? Number(e.target.value) : undefined })}
              options={[
                { value: '', label: 'All Sectors' },
                ...(sectors?.map(s => ({ value: s.id, label: s.name })) || [])
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}
