// ─── AUTH HYDRATION COMPONENT ────────────────────────────────────
// Initializes the Zustand auth store from localStorage on mount.

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';

export function AuthHydration() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
