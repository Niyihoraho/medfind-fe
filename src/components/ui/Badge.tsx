import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline' | 'secondary';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        {
          'border-transparent bg-[var(--med-primary)] text-white shadow-sm': variant === 'default',
          'border-transparent bg-green-50 text-green-700 border-green-100': variant === 'success',
          'border-transparent bg-amber-50 text-amber-700 border-amber-100': variant === 'warning',
          'border-transparent bg-red-50 text-red-700 border-red-100': variant === 'error',
          'border-[var(--med-primary)]/20 bg-transparent text-[var(--med-primary)]': variant === 'outline',
          'border-transparent bg-gray-100 text-gray-600': variant === 'secondary',
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
