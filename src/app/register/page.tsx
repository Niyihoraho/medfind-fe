'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useRegister } from '@/lib/hooks/useAuth';
import type { RegisterPayload } from '@/types';
import { Activity, Sparkles, UserPlus } from 'lucide-react';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';

const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { mutate: registerAccount, isPending } = useRegister();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useReactHookForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    setServerError(null);
    const payload: RegisterPayload = {
      full_name: data.full_name,
      email: data.email,
      password: data.password,
      phone: data.phone,
    };
    
    registerAccount(payload, {
      onError: (error: any) => {
        setServerError(error.response?.data?.error || 'Failed to register. Please try again.');
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <Card className="w-full max-w-md shadow-sm border-[rgba(76,118,59,0.15)] rounded-[14px] bg-white">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
            <UserPlus className="h-7 w-7" />
          </div>
          <div>
            <CardTitle className="text-[20px] font-semibold text-text-main">Create an Account</CardTitle>
            <CardDescription className="text-[13px] text-muted mt-1.5 font-normal">
              Register to book appointments and save your preferences
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
               <div className="rounded-[12px] bg-status-red/10 p-3 text-[13px] text-status-red border border-status-red/20 font-medium">
                {serverError}
              </div>
            )}
            
            <div className="space-y-1">
              <Input
                label="Full Name"
                placeholder="John Doe"
                {...register('full_name')}
                error={errors.full_name?.message}
                className="text-[13px]"
              />
            </div>

            <div className="space-y-1">
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                {...register('email')}
                error={errors.email?.message}
                className="text-[13px]"
              />
            </div>
            
            <div className="space-y-1">
              <Input
                label="Phone Number (Optional)"
                placeholder="078..."
                {...register('phone')}
                error={errors.phone?.message}
                className="text-[13px]"
              />
            </div>
            
            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
                className="text-[13px]"
              />
            </div>

            <div className="space-y-1">
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                {...register('confirm_password')}
                error={errors.confirm_password?.message}
                className="text-[13px]"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full mt-4 h-11 text-[14px] font-medium bg-gradient-to-r from-primary to-deep text-accent hover:opacity-90 border-none rounded-[8px] flex items-center justify-center gap-2" 
              isLoading={isPending}
            >
              {!isPending && <Sparkles className="h-4 w-4 text-accent" />}
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-[13px] text-muted border-t border-[rgba(76,118,59,0.15)] pt-5">
            <p>
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
