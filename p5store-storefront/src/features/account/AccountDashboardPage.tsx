import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { getUser } from '@/api/users';
import { getUserOrders } from '@/api/orders';
import { useWishlist } from '@/lib/wishlist';
import ProductCard from '@/components/ProductCard';
import OrderStatusBar from './OrderStatusBar';

export default function AccountDashboardPage() {
  const { user } = useAuth();
  const { items: savedItems } = useWishlist();

  const userQuery = useQuery({
    queryKey: ['user', user?.userId],
    queryFn: () => getUser(user!.userId),
    enabled: !!user,
  });

  const ordersQuery = useQuery({
    queryKey: ['orders', user?.userId],
    queryFn: () => getUserOrders(user!.userId),
    enabled: !!user,
  });

  const recentOrders = (ordersQuery.data ?? []).slice(0, 3);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-navy-900">
        Welcome back{userQuery.data ? `, ${userQuery.data.firstName}` : ''}
      </h1>

      <section className="mb-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-700/70">
            Recent Orders
          </h2>
          <Link to="/account/orders" className="text-xs font-semibold text-gold-600 hover:underline">
            View All →
          </Link>
        </div>

        {ordersQuery.isLoading && <p className="text-sm text-navy-700/60">Loading…</p>}

        {!ordersQuery.isLoading && recentOrders.length === 0 && (
          <div className="rounded-lg border border-navy-100 bg-navy-50 p-6 text-center">
            <p className="text-sm text-navy-700/70">You haven't placed any orders yet.</p>
            <Link
              to="/"
              className="mt-3 inline-block rounded bg-gold-500 px-4 py-2 text-xs font-semibold text-navy-950 hover:bg-gold-600"
            >
              Start Shopping
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-lg border border-navy-100 p-4"
            >
              <div>
                <p className="text-xs text-navy-700/50">Order ID</p>
                <p className="font-medium text-navy-900">#{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs text-navy-700/50">Date</p>
                <p className="text-sm text-navy-800">
                  {new Date(order.createdAt).toLocaleDateString('en-ZA', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-navy-700/50">Total</p>
                <p className="text-sm font-semibold text-navy-900">R{order.total.toFixed(2)}</p>
              </div>
              <OrderStatusBar status={order.status} />
              <Link
                to="/account/orders"
                className="rounded border border-navy-100 px-3 py-1.5 text-xs font-semibold text-navy-800 hover:bg-navy-50"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-navy-700/70">
          Saved Items &amp; Recommendations
        </h2>
        {savedItems.length === 0 ? (
          <p className="text-sm text-navy-700/60">
            Nothing saved yet — heart an item you love to see it here.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {savedItems.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
