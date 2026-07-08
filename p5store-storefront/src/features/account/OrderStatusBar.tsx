import clsx from 'clsx';
import type { OrderStatus } from '@/types';

const STAGES = ['Processing', 'Shipped', 'Delivered'] as const;

function stageIndex(status: OrderStatus): number {
  switch (status) {
    case 'PENDING':
    case 'CONFIRMED':
    case 'PROCESSING':
      return 0;
    case 'SHIPPED':
      return 1;
    case 'DELIVERED':
      return 2;
    default:
      return -1;
  }
}

export default function OrderStatusBar({ status }: { status: OrderStatus }) {
  if (status === 'CANCELLED' || status === 'REFUNDED') {
    return (
      <span className="inline-block rounded-full bg-status-danger/10 px-2.5 py-0.5 text-xs font-semibold text-status-danger">
        {status === 'CANCELLED' ? 'Cancelled' : 'Refunded'}
      </span>
    );
  }

  const current = stageIndex(status);

  return (
    <div className="flex items-center">
      {STAGES.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={clsx(
                'h-2.5 w-2.5 rounded-full',
                i <= current ? 'bg-gold-500' : 'bg-navy-100'
              )}
            />
            <span className="text-[10px] uppercase tracking-wide text-navy-700/60">
              {label}
            </span>
          </div>
          {i < STAGES.length - 1 && (
            <div
              className={clsx(
                'mx-1 mb-4 h-0.5 w-10',
                i < current ? 'bg-gold-500' : 'bg-navy-100'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
