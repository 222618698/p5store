import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllOrders, getOrderByNumber, updateOrderStatus } from '@/api/orders';
import StatusBadge from '@/components/ui/StatusBadge';
import type { OrderResponse, OrderStatus } from '@/types';

const STATUS_OPTIONS: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
];

const PAGE_SIZE = 10;

export default function OrderLookupPage() {
  const [page, setPage] = useState(0);
  const [orderNumber, setOrderNumber] = useState('');
  const [searchResult, setSearchResult] = useState<OrderResponse | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selected, setSelected] = useState<OrderResponse | null>(null);
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ['orders', 'all', page],
    queryFn: () => getAllOrders({ page, size: PAGE_SIZE }),
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setIsSearching(true);
    setSearchError(null);
    try {
      const result = await getOrderByNumber(orderNumber.trim());
      setSearchResult(result);
      setSelected(result);
    } catch {
      setSearchResult(null);
      setSearchError(`No order found for "${orderNumber}".`);
    } finally {
      setIsSearching(false);
    }
  };

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: (updated) => {
      setSelected(updated);
      if (searchResult?.id === updated.id) setSearchResult(updated);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const orders = ordersQuery.data?.content ?? [];

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6 flex gap-3">
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Look up an order by number, e.g. P5-A1B2C3D4"
          className="w-80 rounded border border-navy-100 bg-white px-3 py-2 text-sm outline-none focus:border-navy-600 focus:ring-1 focus:ring-navy-600"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="rounded bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
        >
          {isSearching ? 'Searching…' : 'Look Up Order'}
        </button>
      </form>

      {searchError && <p className="mb-4 text-sm text-status-danger">{searchError}</p>}

      {selected ? (
        <OrderDetail
          order={selected}
          onBack={() => setSelected(null)}
          onStatusChange={(status) => statusMutation.mutate({ id: selected.id, status })}
          isSaving={statusMutation.isPending}
        />
      ) : (
        <>
          {ordersQuery.isLoading && (
            <p className="text-sm text-navy-700/60">Loading orders…</p>
          )}

          {!ordersQuery.isLoading && orders.length === 0 && (
            <div className="mx-auto max-w-md rounded-lg border border-navy-100 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-50">
                <InboxIcon className="h-7 w-7 text-navy-700/50" />
              </div>
              <h2 className="mb-2 font-display text-xl text-navy-900">No Orders Yet</h2>
              <p className="text-sm text-navy-700/60">
                Your order history is currently empty. Once orders are placed, they
                will appear here along with their corresponding tracking details and
                fulfillment status.
              </p>
            </div>
          )}

          {orders.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-navy-100 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-navy-100 bg-navy-50 text-xs uppercase tracking-wide text-navy-700/70">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-navy-100 last:border-0 hover:bg-navy-50/60">
                      <td className="px-4 py-3 font-medium text-navy-900">{o.orderNumber}</td>
                      <td className="px-4 py-3 text-navy-700">
                        {new Date(o.createdAt).toLocaleDateString('en-ZA', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                      <td className="px-4 py-3 text-right text-navy-900">R{o.total.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelected(o)}
                          className="text-xs font-semibold text-navy-800 hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {ordersQuery.data && ordersQuery.data.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-navy-700">
              <span>
                Page {ordersQuery.data.number + 1} of {ordersQuery.data.totalPages} ·{' '}
                {ordersQuery.data.totalElements} orders
              </span>
              <div className="flex gap-2">
                <button
                  disabled={ordersQuery.data.first}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="rounded border border-navy-100 px-3 py-1.5 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={ordersQuery.data.last}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded border border-navy-100 px-3 py-1.5 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function OrderDetail({
  order,
  onBack,
  onStatusChange,
  isSaving,
}: {
  order: OrderResponse;
  onBack: () => void;
  onStatusChange: (status: OrderStatus) => void;
  isSaving: boolean;
}) {
  return (
    <div className="rounded-lg border border-navy-100 bg-white p-6 shadow-sm">
      <button onClick={onBack} className="mb-4 text-xs font-semibold text-navy-700 hover:underline">
        ← Back to all orders
      </button>

      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="font-display text-lg text-navy-900">{order.orderNumber}</p>
          <p className="text-xs text-navy-700/60">
            Placed {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <table className="mb-4 w-full text-left text-sm">
        <thead className="border-b border-navy-100 text-xs uppercase text-navy-700/60">
          <tr>
            <th className="py-2">Item</th>
            <th className="py-2">SKU</th>
            <th className="py-2">Qty</th>
            <th className="py-2">Unit Price</th>
            <th className="py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, i) => (
            <tr key={i} className="border-b border-navy-100 last:border-0">
              <td className="py-2">{item.productName}</td>
              <td className="py-2 text-navy-700">{item.productSku}</td>
              <td className="py-2">{item.quantity}</td>
              <td className="py-2">R{item.unitPrice.toFixed(2)}</td>
              <td className="py-2 text-right">R{item.subtotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ml-auto max-w-xs space-y-1 text-sm">
        <Row label="Subtotal" value={order.subtotal} />
        <Row label="Shipping" value={order.shippingCost} />
        <Row label="Discount" value={-order.discountAmount} />
        <Row label="Total" value={order.total} bold />
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-navy-100 pt-4">
        <label className="text-sm font-medium text-navy-900">Update status:</label>
        <select
          value={order.status}
          onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
          className="rounded border border-navy-100 px-3 py-1.5 text-sm"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {isSaving && <span className="text-xs text-navy-700/60">Saving…</span>}
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? 'font-semibold text-navy-900' : 'text-navy-700'}`}>
      <span>{label}</span>
      <span>R{value.toFixed(2)}</span>
    </div>
  );
}

function InboxIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M4 4h16l-2 10H6L4 4Z" />
      <path d="M4 14h4a2 2 0 0 0 4 0h4" />
      <path d="M4 14v6h16v-6" />
    </svg>
  );
}
