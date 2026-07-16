import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import AuthShell from '@/components/AuthShell';
import { forgotPassword } from '@/api/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const mutation = useMutation({
    mutationFn: () => forgotPassword({ email }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <AuthShell>
      <h1 className="mb-1 text-center font-display text-xl text-navy-900">
        Forgot Password?
      </h1>
      <p className="mb-5 text-center text-sm text-navy-700/70">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      {mutation.isSuccess ? (
        <div className="text-center">
          <p className="mb-5 rounded border border-status-success/30 bg-green-50 px-3 py-2 text-sm text-status-success">
            If an account exists for {email}, a reset link is on its way. Check your inbox
            (and spam folder).
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <label className="mb-1 block text-sm font-medium text-navy-900">
            Email Address
          </label>
          <input
            type="email"
            required
            className="input mb-1"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {mutation.isError && (
            <p className="mb-3 text-xs text-status-danger">
              Something went wrong. Please try again.
            </p>
          )}
          {!mutation.isError && <div className="mb-4" />}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded bg-gold-500 py-2.5 text-sm font-semibold uppercase tracking-wide text-navy-950 transition hover:bg-gold-600 disabled:opacity-60"
          >
            {mutation.isPending ? 'Sending…' : 'Send Reset Link →'}
          </button>
        </form>
      )}

      <div className="mt-5 text-center">
        <Link to="/login" className="text-xs font-medium text-navy-700 hover:underline">
          ← Back to Login
        </Link>
      </div>
    </AuthShell>
  );
}
