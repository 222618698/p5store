import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthShell from '@/components/AuthShell';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // NOTE: no backend endpoint exists yet for password-reset emails.
    // This simulates the request so the flow can be reviewed end-to-end;
    // wire this up to a real POST /v1/auth/forgot-password once email
    // sending infrastructure is in place.
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 700);
  };

  return (
    <AuthShell>
      <h1 className="mb-1 text-center font-display text-xl text-navy-900">
        Forgot Password?
      </h1>
      <p className="mb-5 text-center text-sm text-navy-700/70">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      {sent ? (
        <div className="text-center">
          <p className="mb-5 rounded border border-status-success/30 bg-green-50 px-3 py-2 text-sm text-status-success">
            If an account exists for {email}, a reset link is on its way.
          </p>
          <button
            onClick={() => navigate('/reset-password')}
            className="w-full rounded bg-gold-500 py-2.5 text-sm font-semibold uppercase tracking-wide text-navy-950 transition hover:bg-gold-600"
          >
            Continue (Preview Reset Screen)
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <label className="mb-1 block text-sm font-medium text-navy-900">
            Email Address
          </label>
          <input
            type="email"
            required
            className="input mb-5"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={sending}
            className="w-full rounded bg-gold-500 py-2.5 text-sm font-semibold uppercase tracking-wide text-navy-950 transition hover:bg-gold-600 disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Send Reset Link →'}
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
