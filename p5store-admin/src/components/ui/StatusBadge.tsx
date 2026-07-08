import clsx from 'clsx';

const STYLES: Record<string, string> = {
  ACTIVE: 'bg-status-success/10 text-status-success',
  INACTIVE: 'bg-navy-100 text-navy-700',
  OUT_OF_STOCK: 'bg-status-danger/10 text-status-danger',

  PENDING: 'bg-status-warning/10 text-status-warning',
  CONFIRMED: 'bg-status-info/10 text-status-info',
  PROCESSING: 'bg-status-info/10 text-status-info',
  SHIPPED: 'bg-gold-100 text-gold-600',
  DELIVERED: 'bg-status-success/10 text-status-success',
  CANCELLED: 'bg-status-danger/10 text-status-danger',
  REFUNDED: 'bg-navy-100 text-navy-700',
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold',
        STYLES[status] ?? 'bg-navy-100 text-navy-700'
      )}
    >
      {status.replace('_', ' ')}
    </span>
  );
}
