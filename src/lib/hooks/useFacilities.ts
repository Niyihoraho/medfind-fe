// ─── FACILITY HOOKS ──────────────────────────────────────────────
// React Query hooks for facility search and CRUD.

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse, Facility, PaginatedResult, FacilitySearchParams } from '@/types';

export function useFacilities(params: FacilitySearchParams) {
  return useQuery({
    queryKey: ['facilities', params],
    queryFn: async () => {
      // Build query string from non-empty params
      const query = Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== '' && v !== null)
        .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
        .join('&');
      const { data } = await api.get<ApiResponse<PaginatedResult<Facility>>>(`/facilities?${query}`);
      return data.data;
    },
    staleTime: 30_000,
  });
}

export function useFacility(id: number | string | undefined) {
  return useQuery({
    queryKey: ['facility', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Facility>>(`/facilities/${id}`);
      return data.data;
    },
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useCreateFacility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post<ApiResponse<Facility>>('/facilities', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    },
  });
}

export function useUpdateFacility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: number } & Record<string, unknown>) => {
      const { data } = await api.put<ApiResponse<Facility>>(`/facilities/${id}`, payload);
      return data.data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      queryClient.invalidateQueries({ queryKey: ['facility', vars.id] });
    },
  });
}

export function useDeleteFacility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/facilities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    },
  });
}

export function useVerifyFacility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.patch<ApiResponse<Facility>>(`/facilities/${id}/verify`);
      return data.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      queryClient.invalidateQueries({ queryKey: ['facility', id] });
    },
  });
}

// ─── FACILITY SERVICE MANAGEMENT ─────────────────────────────────

export function useAddFacilityService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ facilityId, serviceId }: { facilityId: number; serviceId: number }) => {
      const { data } = await api.post(`/facilities/${facilityId}/services`, { service_id: serviceId });
      return data.data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['facility', vars.facilityId] });
    },
  });
}

export function useRemoveFacilityService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ facilityId, serviceId }: { facilityId: number; serviceId: number }) => {
      await api.delete(`/facilities/${facilityId}/services/${serviceId}`);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['facility', vars.facilityId] });
    },
  });
}

export function useToggleFacilityService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ facilityId, serviceId }: { facilityId: number; serviceId: number }) => {
      const { data } = await api.patch(`/facilities/${facilityId}/services/${serviceId}`);
      return data.data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['facility', vars.facilityId] });
    },
  });
}

// ─── FACILITY INSURANCE MANAGEMENT ───────────────────────────────

export function useAddFacilityInsurance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ facilityId, insuranceId }: { facilityId: number; insuranceId: number }) => {
      const { data } = await api.post(`/facilities/${facilityId}/insurances`, { insurance_id: insuranceId });
      return data.data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['facility', vars.facilityId] });
    },
  });
}

export function useRemoveFacilityInsurance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ facilityId, insuranceId }: { facilityId: number; insuranceId: number }) => {
      await api.delete(`/facilities/${facilityId}/insurances/${insuranceId}`);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['facility', vars.facilityId] });
    },
  });
}
