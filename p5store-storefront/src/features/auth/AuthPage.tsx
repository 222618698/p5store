import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import clsx from 'clsx';
import AuthShell from '@/components/AuthShell';
import { useAuth } from '@/context/AuthContext';
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from './schema';

type Mode = 'login' | 'register';

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login');

  return (
    <AuthShell>
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-full bg-navy-50 p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={clsx(
              'rounded-full px-6 py-1.5 text-xs font-semibold uppercase tracking-wide transition',
              mode === 'login'
                ? 'bg-gold-500 text-navy-950'
                : 'text-navy-700/60 hover:text-navy-900'
            )}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={clsx(
              'rounded-full px-6 py-1.5 text-xs font-semibold uppercase tracking-wide transition',
              mode === 'register'
                ? 'bg-gold-500 text-navy-950'
                : 'text-navy-700/60 hover:text-navy-900'
            )}
          >
            Register
          </button>
        </div>
      </div>

      {mode === 'login' ? <LoginForm /> : <RegisterForm />}
    </AuthShell>
  );
}

function EyeToggle({ shown, onClick }: { shown: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={-1}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-700/40 hover:text-navy-700"
    >
      {shown ? (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
          <path d="M3 3l18 18" />
        </svg>
      )}
    </button>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch {
      setServerError('Invalid email or password. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className="mb-5 text-center font-display text-xl text-navy-900">
        Log In to Your Account
      </h1>

      {serverError && (
        <div className="mb-4 rounded border border-status-danger/30 bg-red-50 px-3 py-2 text-sm text-status-danger">
          {serverError}
        </div>
      )}

      <label className="mb-1 block text-sm font-medium text-navy-900">Email Address</label>
      <input
        type="email"
        autoComplete="email"
        className="input mb-1"
        placeholder="Email Address"
        {...register('email')}
      />
      {errors.email && <p className="mb-3 text-xs text-status-danger">{errors.email.message}</p>}
      {!errors.email && <div className="mb-3" />}

      <label className="mb-1 block text-sm font-medium text-navy-900">Password</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          className="input mb-1 pr-10"
          placeholder="Password"
          {...register('password')}
        />
        <EyeToggle shown={showPassword} onClick={() => setShowPassword((v) => !v)} />
      </div>
      {errors.password && (
        <p className="mb-1 text-xs text-status-danger">{errors.password.message}</p>
      )}

      <div className="mb-4 mt-1 text-right">
        <Link to="/forgot-password" className="text-xs font-medium text-navy-700 hover:underline">
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-gold-500 py-2.5 text-sm font-semibold uppercase tracking-wide text-navy-950 transition hover:bg-gold-600 disabled:opacity-60"
      >
        {isSubmitting ? 'Signing in…' : 'Log In'}
      </button>
    </form>
  );
}

function RegisterForm() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    const [firstName, ...rest] = values.fullName.trim().split(' ');
    const lastName = rest.join(' ') || firstName;
    try {
      await registerUser({
        firstName,
        lastName,
        email: values.email,
        password: values.password,
      });
      navigate('/');
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Couldn't create your account. Please try again.";
      setServerError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className="mb-5 text-center font-display text-xl text-navy-900">
        Create Your Account
      </h1>

      {serverError && (
        <div className="mb-4 rounded border border-status-danger/30 bg-red-50 px-3 py-2 text-sm text-status-danger">
          {serverError}
        </div>
      )}

      <label className="mb-1 block text-sm font-medium text-navy-900">Full Name</label>
      <input className="input mb-1" placeholder="Full Name" {...register('fullName')} />
      {errors.fullName && (
        <p className="mb-3 text-xs text-status-danger">{errors.fullName.message}</p>
      )}
      {!errors.fullName && <div className="mb-3" />}

      <label className="mb-1 block text-sm font-medium text-navy-900">Email Address</label>
      <input
        type="email"
        autoComplete="email"
        className="input mb-1"
        placeholder="Email Address"
        {...register('email')}
      />
      {errors.email && <p className="mb-3 text-xs text-status-danger">{errors.email.message}</p>}
      {!errors.email && <div className="mb-3" />}

      <label className="mb-1 block text-sm font-medium text-navy-900">Password</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          className="input mb-1 pr-10"
          placeholder="Password"
          {...register('password')}
        />
        <EyeToggle shown={showPassword} onClick={() => setShowPassword((v) => !v)} />
      </div>
      {errors.password && (
        <p className="mb-3 text-xs text-status-danger">{errors.password.message}</p>
      )}
      {!errors.password && <div className="mb-3" />}

      <label className="mb-1 block text-sm font-medium text-navy-900">Confirm Password</label>
      <input
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        className="input mb-1"
        placeholder="Confirm Password"
        {...register('confirmPassword')}
      />
      {errors.confirmPassword && (
        <p className="mb-3 text-xs text-status-danger">{errors.confirmPassword.message}</p>
      )}
      {!errors.confirmPassword && <div className="mb-3" />}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-gold-500 py-2.5 text-sm font-semibold uppercase tracking-wide text-navy-950 transition hover:bg-gold-600 disabled:opacity-60"
      >
        {isSubmitting ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  );
}
