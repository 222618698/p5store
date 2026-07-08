import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { loginSchema, type LoginFormValues } from './schema';
import logo from '@/assets/logo.png';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await login(values.email, values.password);
      const redirectTo = (location.state as { from?: string })?.from ?? '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(
        'Login failed. Check your email and password and try again.'
      );
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img src={logo} alt="Pillar 5 — Above Average" className="mx-auto h-24 w-auto" />
          <h1 className="font-display mt-2 text-3xl text-white">
            P5Store Admin
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-lg bg-white p-8 shadow-xl"
          noValidate
        >
          {serverError && (
            <div className="mb-4 rounded border border-status-danger/30 bg-red-50 px-3 py-2 text-sm text-status-danger">
              {serverError}
            </div>
          )}

          <label className="mb-1 block text-sm font-medium text-navy-900">
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            className="mb-1 w-full rounded border border-navy-100 px-3 py-2 text-sm outline-none focus:border-navy-600 focus:ring-1 focus:ring-navy-600"
            placeholder="you@pillar5.co.za"
            {...register('email')}
          />
          {errors.email && (
            <p className="mb-3 text-xs text-status-danger">
              {errors.email.message}
            </p>
          )}
          {!errors.email && <div className="mb-3" />}

          <label className="mb-1 block text-sm font-medium text-navy-900">
            Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            className="mb-1 w-full rounded border border-navy-100 px-3 py-2 text-sm outline-none focus:border-navy-600 focus:ring-1 focus:ring-navy-600"
            placeholder="••••••••"
            {...register('password')}
          />
          {errors.password && (
            <p className="mb-3 text-xs text-status-danger">
              {errors.password.message}
            </p>
          )}
          {!errors.password && <div className="mb-3" />}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded bg-navy-800 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
