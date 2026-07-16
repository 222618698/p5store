import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import AuthShell from '@/components/AuthShell';
import { resetPassword } from '@/api/auth';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => resetPassword({ token: token!, newPassword: password }),
    onSuccess: () => navigate('/reset-password/success'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError("Passwords don't match.");
      return;
    }

    mutation.mutate();
  };

  if (!token) {
    return (
      <AuthShell>
        <h1 className="mb-1 text-center font-display text-xl text-navy-900">
          Invalid Reset Link
        </h1>
        <p className="mb-5 text-center text-sm text-navy-700/70">
          This password reset link is missing or invalid. Please request a new one.
        </p>
        <Link
          to="/forgot-password"
          className="block w-full rounded bg-gold-500 py-2.5 text-center text-sm font-semibold uppercase tracking-wide text-navy-950 transition hover:bg-gold-600"
        >
          Request New Link
        </Link>
        <div className="mt-5 text-center">
          <Link to="/login" className="text-xs font-medium text-navy-700 hover:underline">
            Back to Login
          </Link>
        </div>
      </AuthShell>
    );
  }

  const error =
    validationError ??
    (mutation.isError ? 'This reset link is invalid or has expired. Please request a new one.' : null);

  return (
    <AuthShell>
      <h1 className="mb-1 text-center font-display text-xl text-navy-900">
        Reset Your Password
      </h1>
      <p className="mb-5 text-center text-sm text-navy-700/70">
        Choose a strong password for your account.
      </p>

      {error && (
        <div className="mb-4 rounded border border-status-danger/30 bg-red-50 px-3 py-2 text-sm text-status-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <label className="mb-1 block text-sm font-medium text-navy-900">
          New Password
        </label>
        <input
          type="password"
          autoComplete="new-password"
          className="input mb-4"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="mb-1 block text-sm font-medium text-navy-900">
          Confirm New Password
        </label>
        <input
          type="password"
          autoComplete="new-password"
          className="input mb-1"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <p className="mb-5 text-xs text-navy-700/50">
          Use 6+ characters with a mix of letters and numbers.
        </p>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded bg-gold-500 py-2.5 text-sm font-semibold uppercase tracking-wide text-navy-950 transition hover:bg-gold-600 disabled:opacity-60"
        >
          {mutation.isPending ? 'Updating…' : 'Update Password'}
        </button>
      </form>

      <div className="mt-5 text-center">
        <Link to="/login" className="text-xs font-medium text-navy-700 hover:underline">
          Back to Login
        </Link>
      </div>
    </AuthShell>
  );
}
