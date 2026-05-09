'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useAuthStore } from '@/store/auth.store';
import { useLogin } from '@/lib/hooks';
import type { LoginPayload } from '@/types';
import { Activity, Sparkles } from 'lucide-react';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      if (user?.role === 'super_admin') {
        router.push('/super-admin');
      } else if (user?.role === 'facility_admin') {
        router.push('/facility-admin/my-facility');
      } else if (user?.role === 'patient') {
        router.push('/');
      }
    }
  }, [isHydrated, isAuthenticated, user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useReactHookForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginPayload) => {
    setServerError(null);
    login(data, {
      onError: (error: any) => {
        setServerError(error.response?.data?.error || 'Failed to login. Please check your credentials.');
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <Card className="w-full max-w-md shadow-sm border-[rgba(76,118,59,0.15)] rounded-[14px] bg-white">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
            <Activity className="h-7 w-7" />
          </div>
          <div>
            <CardTitle className="text-[20px] font-semibold text-text-main">Welcome Back</CardTitle>
            <CardDescription className="text-[13px] text-muted mt-1.5 font-normal">
              Sign in to your MEDFIND admin account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <div className="rounded-[12px] bg-status-red/10 p-3 text-[13px] text-status-red border border-status-red/20 font-medium">
                {serverError}
              </div>
            )}

            <div className="space-y-1">
              <Input
                label="Email Address"
                type="email"
                placeholder="admin@medfind.rw"
                {...register('email')}
                error={errors.email?.message}
                autoComplete="email"
                className="text-[13px] border-primary/20 focus-visible:ring-primary/30"
              />
            </div>

            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
                autoComplete="current-password"
                className="text-[13px] border-primary/20 focus-visible:ring-primary/30"
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-4 h-11 text-[14px] font-medium bg-gradient-to-r from-primary to-deep text-accent hover:opacity-90 border-none rounded-[8px] flex items-center justify-center gap-2"
              isLoading={isPending}
            >
              {!isPending && <Sparkles className="h-4 w-4 text-accent" />}
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
