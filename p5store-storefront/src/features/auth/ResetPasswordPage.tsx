import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthShell from '@/components/AuthShell';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    // NOTE: no backend endpoint exists yet for applying a password reset.
    // Wire this up to a real POST /v1/auth/reset-password (with the token
    // from the emailed link) once that lands.
    setTimeout(() => {
      setSubmitting(false);
      navigate('/reset-password/success');
    }, 700);
  };

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
          disabled={submitting}
          className="w-full rounded bg-gold-500 py-2.5 text-sm font-semibold uppercase tracking-wide text-navy-950 transition hover:bg-gold-600 disabled:opacity-60"
        >
          {submitting ? 'Updating…' : 'Update Password'}
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
