// ─── AUTH HOOKS ──────────────────────────────────────────────────
// React Query hooks for authentication API calls.

'use client';

import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse, AuthResponse, LoginPayload, RegisterPayload, User } from '@/types';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload);
      return data.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      // Redirect based on role
      if (data.user.role === 'super_admin') {
        router.push('/super-admin');
      } else if (data.user.role === 'facility_admin') {
        router.push('/facility-admin/my-facility');
      } else {
        router.push('/');
      }
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload);
      return data.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      router.push('/');
    },
  });
}

export function useGetMe() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get<ApiResponse<User>>('/auth/me');
      return data.data;
    },
  });
}
