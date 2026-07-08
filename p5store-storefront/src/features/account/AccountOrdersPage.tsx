import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { getUserOrders } from '@/api/orders';
import OrderStatusBar from './OrderStatusBar';

export default function AccountOrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const ordersQuery = useQuery({
    queryKey: ['orders', user?.userId],
    queryFn: () => getUserOrders(user!.userId),
    enabled: !!user,
  });

  const orders = ordersQuery.data ?? [];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-navy-900">My Orders</h1>

      {ordersQuery.isLoading && <p className="text-sm text-navy-700/60">Loading…</p>}

      {!ordersQuery.isLoading && orders.length === 0 && (
        <div className="mx-auto max-w-md rounded-lg bg-navy-50 px-8 py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <BoxIcon className="h-7 w-7 text-navy-700/50" />
          </div>
          <h2 className="mb-2 font-display text-xl text-navy-900">No Orders Yet</h2>
          <p className="mb-6 text-sm text-navy-700/60">
            You haven't placed any orders yet. Discover our latest collections and
            find something you'll love.
          </p>
          <button
            onClick={() => navigate('/')}
            className="rounded bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-gold-600"
          >
            Start Shopping
          </button>
        </div>
      )}

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg border border-navy-100 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-navy-700/50">Order #{order.orderNumber}</p>
                <p className="text-sm text-navy-800">
                  {new Date(order.createdAt).toLocaleDateString('en-ZA', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <OrderStatusBar status={order.status} />
              <p className="font-semibold text-navy-900">R{order.total.toFixed(2)}</p>
            </div>
            <div className="border-t border-navy-100 pt-3 text-sm text-navy-700/70">
              {order.items.map((item) => (
                <div key={item.productSku} className="flex justify-between">
                  <span>
                    {item.quantity}× {item.productName}
                  </span>
                  <span>R{item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BoxIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
      <path d="M3 8l9 5 9-5M12 13v8" />
    </svg>
  );
}
