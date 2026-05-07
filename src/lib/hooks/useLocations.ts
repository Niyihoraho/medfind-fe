// ─── LOCATION HOOKS ──────────────────────────────────────────────
// React Query hooks for Rwanda administrative geography cascade.

'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse, Province, District, Sector, PlaceCenter } from '@/types';

export function useProvinces() {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Province[]>>('/provinces');
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes — geography doesn't change often
  });
}

export function useDistricts(provinceId: number | undefined) {
  return useQuery({
    queryKey: ['districts', provinceId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<District[]>>(`/provinces/${provinceId}/districts`);
      return data.data;
    },
    enabled: !!provinceId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSectors(districtId: number | undefined) {
  return useQuery({
    queryKey: ['sectors', districtId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Sector[]>>(`/districts/${districtId}/sectors`);
      return data.data;
    },
    enabled: !!districtId,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlaceCenter(type: string | undefined, id: number | undefined) {
  return useQuery({
    queryKey: ['placeCenter', type, id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PlaceCenter>>(`/place-centers/${type}/${id}`);
      return data.data;
    },
    enabled: !!type && !!id,
    staleTime: 5 * 60 * 1000,
  });
}
