import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getOrderByNumber } from '@/api/orders';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();

  const orderQuery = useQuery({
    queryKey: ['orders', 'number', orderNumber],
    queryFn: () => getOrderByNumber(orderNumber!),
    enabled: !!orderNumber,
  });

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="mx-auto w-full max-w-lg flex-1 px-6 py-16 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gold-100">
          <svg className="h-8 w-8 text-gold-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="mb-2 font-display text-2xl text-navy-900">Order Placed!</h1>
        <p className="mb-6 text-sm text-navy-700/60">
          Thank you for your order. A confirmation has been recorded and you can track its
          progress from your account.
        </p>

        {orderQuery.data && (
          <div className="mb-6 rounded-lg border border-navy-100 p-5 text-left text-sm">
            <div className="mb-3 flex justify-between">
              <span className="text-navy-700/60">Order Number</span>
              <span className="font-semibold text-navy-900">{orderQuery.data.orderNumber}</span>
            </div>
            <div className="mb-3 flex justify-between">
              <span className="text-navy-700/60">Total</span>
              <span className="font-semibold text-navy-900">R{orderQuery.data.total.toFixed(2)}</span>
            </div>
            <div className="space-y-1 border-t border-navy-100 pt-3 text-navy-700">
              {orderQuery.data.items.map((item) => (
                <div key={item.productSku} className="flex justify-between">
                  <span>{item.quantity}× {item.productName}</span>
                  <span>R{item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center gap-3">
          <Link
            to="/"
            className="rounded border border-navy-100 px-5 py-2.5 text-sm font-semibold text-navy-800 hover:bg-navy-50"
          >
            Continue Shopping
          </Link>
          <Link
            to="/account/orders"
            className="rounded bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 hover:bg-gold-600"
          >
            View Order
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
