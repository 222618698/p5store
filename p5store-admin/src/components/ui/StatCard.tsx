interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  accent?: 'navy' | 'gold';
}

export default function StatCard({ label, value, hint, accent = 'navy' }: StatCardProps) {
  return (
    <div className="rounded-lg border border-navy-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-navy-700/70">
        {label}
      </p>
      <p
        className={
          'font-display mt-2 text-3xl ' +
          (accent === 'gold' ? 'text-gold-600' : 'text-navy-900')
        }
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-navy-700/60">{hint}</p>}
    </div>
  );
}
