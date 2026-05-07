import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveImageUrl(url: string | null | undefined) {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  
  // For relative paths like /uploads/..., prepend the backend URL
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiBase.replace('/api', '');
  return `${baseUrl}${url}`;
}
