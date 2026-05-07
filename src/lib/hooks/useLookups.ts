// ─── LOOKUP HOOKS ────────────────────────────────────────────────
// React Query hooks for services and insurance schemes.

'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse, Service, InsuranceScheme } from '@/types';

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Service[]>>('/services');
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useInsuranceSchemes() {
  return useQuery({
    queryKey: ['insuranceSchemes'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<InsuranceScheme[]>>('/insurance-schemes');
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
