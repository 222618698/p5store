import { useNavigate } from 'react-router-dom';
import AuthShell from '@/components/AuthShell';

export default function ResetSuccessPage() {
  const navigate = useNavigate();

  return (
    <AuthShell>
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold-100">
          <svg
            className="h-7 w-7 text-gold-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="mb-2 font-display text-xl text-navy-900">
          Password Reset Successful
        </h1>
        <p className="mb-6 text-sm text-navy-700/70">
          Your password has been successfully updated. You can now log in with your
          new credentials.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full rounded bg-gold-500 py-2.5 text-sm font-semibold uppercase tracking-wide text-navy-950 transition hover:bg-gold-600"
        >
          Sign In →
        </button>
      </div>
    </AuthShell>
  );
}
