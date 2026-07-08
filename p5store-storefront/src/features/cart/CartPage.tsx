import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { getCart, removeCartItem, updateCartItem } from '@/api/cart';
import { validatePromoCode } from '@/api/discounts';
import { getAppliedCoupon, setAppliedCoupon, clearAppliedCoupon } from '@/lib/checkoutCoupon';

const FREE_SHIPPING_THRESHOLD = 500;
const STANDARD_SHIPPING_COST = 50;

export default function CartPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [promoCode, setPromoCode] = useState(getAppliedCoupon() ?? '');
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const cartQuery = useQuery({
    queryKey: ['cart', user?.userId],
    queryFn: () => getCart(user!.userId),
    enabled: isAuthenticated,
  });

  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      updateCartItem(user!.userId, productId, quantity),
    onSuccess: (data) => queryClient.setQueryData(['cart', user?.userId], data),
  });

  const removeMutation = useMutation({
    mutationFn: (productId: number) => removeCartItem(user!.userId, productId),
    onSuccess: (data) => queryClient.setQueryData(['cart', user?.userId], data),
  });

  const items = cartQuery.data?.items ?? [];
  const isEmpty = !isAuthenticated || items.length === 0;
  const subtotal = cartQuery.data?.total ?? 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const discount = appliedDiscount ?? 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const applyPromoMutation = useMutation({
    mutationFn: () => validatePromoCode({ code: promoCode.trim(), subtotal }),
    onSuccess: (data) => {
      if (data.valid) {
        setAppliedDiscount(data.discountAmount);
        setAppliedCoupon(promoCode.trim());
      } else {
        setAppliedDiscount(null);
        clearAppliedCoupon();
      }
      setPromoMessage(data.message);
    },
    onError: () => {
      setAppliedDiscount(null);
      clearAppliedCoupon();
      setPromoMessage("Couldn't validate that code. Try again.");
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        {cartQuery.isLoading ? (
          <p className="text-center text-sm text-navy-700/60">Loading your cart…</p>
        ) : isEmpty ? (
          <div className="mx-auto max-w-md rounded-lg bg-navy-50 px-8 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <BagIcon className="h-7 w-7 text-navy-700/50" />
            </div>
            <h1 className="mb-2 font-display text-2xl text-navy-900">Your Cart is Quiet</h1>
            <p className="mb-6 text-sm text-navy-700/60">
              It looks like you haven't added anything yet. Explore our curated
              collection of premium goods and discover your next statement piece.
            </p>
            <button
              onClick={() => navigate('/')}
              className="rounded bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-gold-600"
            >
              Start Shopping →
            </button>
            <div className="mt-4 flex justify-center gap-4 text-xs font-medium text-navy-700">
              {!isAuthenticated && <Link to="/login" className="hover:underline">Sign In</Link>}
              <Link to="/wishlist" className="hover:underline">View Saved Items</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h1 className="mb-6 font-display text-2xl text-navy-900">Shopping Cart</h1>
              <div className="divide-y divide-navy-100 rounded-lg border border-navy-100">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4 p-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded bg-navy-50">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-navy-900">{item.productName}</p>
                      <p className="text-sm text-navy-700/60">R{item.unitPrice.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateMutation.mutate({
                            productId: item.productId,
                            quantity: Math.max(1, item.quantity - 1),
                          })
                        }
                        className="h-7 w-7 rounded border border-navy-100 text-navy-700 hover:bg-navy-50"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateMutation.mutate({
                            productId: item.productId,
                            quantity: item.quantity + 1,
                          })
                        }
                        className="h-7 w-7 rounded border border-navy-100 text-navy-700 hover:bg-navy-50"
                      >
                        +
                      </button>
                    </div>
                    <p className="w-24 text-right font-semibold text-navy-900">
                      R{item.subtotal.toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeMutation.mutate(item.productId)}
                      className="text-xs font-semibold text-status-danger hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-navy-100 p-5">
              <h2 className="mb-4 font-display text-lg text-navy-900">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-navy-700">
                  <span>Subtotal</span>
                  <span>R{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-navy-700">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `R${shipping.toFixed(2)}`}</span>
                </div>
                {appliedDiscount != null && appliedDiscount > 0 && (
                  <div className="flex justify-between text-status-success">
                    <span>Discount</span>
                    <span>−R{appliedDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-navy-100 pt-2 font-semibold text-navy-900">
                  <span>Total</span>
                  <span>R{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1 block text-xs font-medium text-navy-900">
                  Apply Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    className="input"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      setPromoMessage(null);
                    }}
                  />
                  <button
                    onClick={() => applyPromoMutation.mutate()}
                    disabled={!promoCode.trim() || applyPromoMutation.isPending}
                    className="shrink-0 rounded bg-navy-800 px-4 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p
                    className={`mt-1 text-xs ${appliedDiscount ? 'text-status-success' : 'text-status-danger'}`}
                  >
                    {promoMessage}
                  </p>
                )}
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="mt-5 w-full rounded bg-navy-900 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function BagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M6 7h12l1 14H5L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}
