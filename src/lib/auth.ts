// ─── AUTH HELPERS ────────────────────────────────────────────────
// Utility functions for managing auth tokens in the browser.

import type { User } from '@/types';

const TOKEN_KEY = 'medfind_token';
const USER_KEY = 'medfind_user';

export const authHelpers = {
  /** Store auth data in localStorage */
  setAuth(token: string, user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /** Get the stored JWT token */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  /** Get the stored user object */
  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  /** Clear all auth data */
  clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /** Check if user is authenticated */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  /** Set a cookie for the proxy (route protection) */
  setAuthCookie(token: string): void {
    if (typeof window === 'undefined') return;
    document.cookie = `medfind_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
  },

  /** Clear the auth cookie */
  clearAuthCookie(): void {
    if (typeof window === 'undefined') return;
    document.cookie = 'medfind_token=; path=/; max-age=0';
  },
};
