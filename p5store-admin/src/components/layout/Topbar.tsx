import { useAuth } from '@/context/AuthContext';

interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-navy-100 bg-white px-8">
      <h1 className="font-display text-xl text-navy-900">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-navy-900">{user?.email}</p>
          <p className="text-xs text-navy-700/70">{user?.role}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-100 text-sm font-semibold text-navy-800">
          {user?.email?.[0]?.toUpperCase() ?? 'A'}
        </div>
        <button
          onClick={logout}
          className="rounded border border-navy-100 px-3 py-1.5 text-xs font-semibold text-navy-800 transition hover:border-navy-800 hover:bg-navy-800 hover:text-white"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
