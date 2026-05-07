// ─── AUTH STORE ──────────────────────────────────────────────────
// Zustand store for managing authentication state.
// Persists user and token across page refreshes via localStorage.

'use client';

import { create } from 'zustand';
import type { User } from '@/types';
import { authHelpers } from '@/lib/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  // Actions
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,

  setAuth: (user: User, token: string) => {
    authHelpers.setAuth(token, user);
    authHelpers.setAuthCookie(token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    authHelpers.clearAuth();
    authHelpers.clearAuthCookie();
    set({ user: null, token: null, isAuthenticated: false });
  },

  hydrate: () => {
    const token = authHelpers.getToken();
    const user = authHelpers.getUser();
    if (token && user) {
      set({ user, token, isAuthenticated: true, isHydrated: true });
    } else {
      set({ isHydrated: true });
    }
  },
}));
