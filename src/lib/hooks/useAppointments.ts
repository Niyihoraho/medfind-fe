// ─── APPOINTMENT HOOKS ───────────────────────────────────────────
// React Query hooks for appointment booking and management.

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse, Appointment } from '@/types';

export function useAppointments() {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Appointment[]>>('/appointments');
      return data.data;
    },
    staleTime: 30_000,
  });
}

export function useAppointment(id: number | null) {
  return useQuery({
    queryKey: ['appointments', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Appointment>>(`/appointments/${id}`);
      return data.data;
    },
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      facility_id: number;
      service_name?: string;
      appointment_date: string;
      notes?: string;
      full_name: string;
      email: string;
      phone: string;
    }) => {
      const { data } = await api.post<ApiResponse<Appointment & { bookingRef: string }>>('/appointments', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { data } = await api.patch<ApiResponse<Appointment>>(`/appointments/${id}`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/appointments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}
