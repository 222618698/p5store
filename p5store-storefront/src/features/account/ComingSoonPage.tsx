export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <div>
      <h1 className="mb-4 font-display text-2xl text-navy-900">{title}</h1>
      <div className="rounded-lg border border-dashed border-navy-100 bg-navy-50 p-10 text-center">
        <p className="text-sm text-navy-700/60">
          This section is coming soon — it needs a bit more backend work before it can go live.
        </p>
      </div>
    </div>
  );
}
