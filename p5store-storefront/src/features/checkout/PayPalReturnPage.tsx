import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { capturePayPalOrder } from '@/api/orders';

// Landing page for PayPal's redirect back after the shopper approves (or
// cancels) payment on PayPal's site. Captures the payment server-side using
// the orderId in the URL, then forwards to the normal confirmation page.
export default function PayPalReturnPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [error, setError] = useState<string | null>(null);
  const attempted = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !orderId || attempted.current) return;
    attempted.current = true;

    capturePayPalOrder(user!.userId, Number(orderId))
      .then((order) => navigate(`/order-confirmation/${order.orderNumber}`, { replace: true }))
      .catch((err: unknown) => {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "We couldn't confirm your PayPal payment.";
        setError(message);
      });
  }, [isAuthenticated, orderId, user, navigate]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!orderId) return <Navigate to="/checkout" replace />;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="mx-auto w-full max-w-lg flex-1 px-6 py-16 text-center">
        {error ? (
          <>
            <h1 className="mb-2 font-display text-2xl text-navy-900">Payment Not Confirmed</h1>
            <p className="mb-6 text-sm text-navy-700/60">{error}</p>
            <div className="flex justify-center gap-3">
              <Link
                to="/account/orders"
                className="rounded border border-navy-100 px-5 py-2.5 text-sm font-semibold text-navy-800 hover:bg-navy-50"
              >
                View My Orders
              </Link>
              <Link
                to="/checkout"
                className="rounded bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 hover:bg-gold-600"
              >
                Back to Checkout
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="mb-2 font-display text-2xl text-navy-900">Confirming Your Payment…</h1>
            <p className="text-sm text-navy-700/60">Please wait a moment, this only takes a second.</p>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
