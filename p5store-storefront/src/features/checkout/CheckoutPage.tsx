import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { getCart } from '@/api/cart';
import { getAddresses, createAddress } from '@/api/addresses';
import { placeOrder } from '@/api/orders';
import { validatePromoCode } from '@/api/discounts';
import { getAppliedCoupon, clearAppliedCoupon } from '@/lib/checkoutCoupon';
import type { AddressRequest, AddressResponse, ShippingMethod } from '@/types';

const PROVINCES = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo',
  'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape',
];

const SHIPPING_OPTIONS: { value: ShippingMethod; label: string; description: string }[] = [
  { value: 'STANDARD', label: 'Standard Delivery', description: 'Estimated delivery: 3-5 business days' },
  { value: 'EXPRESS', label: 'Express Delivery', description: 'Estimated delivery: 1-2 business days' },
  { value: 'SAME_DAY', label: 'Same Day Delivery', description: 'Order before 12PM. Available in select areas.' },
];

const PAYMENT_OPTIONS = [
  { value: 'CARD', label: 'Credit / Debit Card' },
  { value: 'EFT', label: 'Instant EFT' },
  { value: 'SNAPSCAN', label: 'SnapScan' },
];

const STEPS = ['Address', 'Shipping', 'Payment', 'Review'];

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COSTS: Record<ShippingMethod, number> = {
  STANDARD: 0, // resolved dynamically below
  EXPRESS: 150,
  SAME_DAY: 350,
};

export default function CheckoutPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('STANDARD');
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [placeError, setPlaceError] = useState<string | null>(null);

  const cartQuery = useQuery({
    queryKey: ['cart', user?.userId],
    queryFn: () => getCart(user!.userId),
    enabled: isAuthenticated,
  });

  const addressesQuery = useQuery({
    queryKey: ['addresses', user?.userId],
    queryFn: () => getAddresses(user!.userId),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!cartQuery.isLoading && (cartQuery.data?.items.length ?? 0) === 0) {
    return <Navigate to="/cart" replace />;
  }

  const subtotal = cartQuery.data?.total ?? 0;
  const shippingCost =
    shippingMethod === 'STANDARD'
      ? (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 50)
      : SHIPPING_COSTS[shippingMethod];
  const couponCode = getAppliedCoupon();

  const discountQuery = useQuery({
    queryKey: ['discount-preview', couponCode, subtotal],
    queryFn: () => validatePromoCode({ code: couponCode!, subtotal }),
    enabled: !!couponCode && subtotal > 0,
  });
  const discountAmount = discountQuery.data?.valid ? discountQuery.data.discountAmount : 0;

  const selectedAddress = addressesQuery.data?.find((a) => a.id === selectedAddressId) ?? null;

  const placeOrderMutation = useMutation({
    mutationFn: () =>
      placeOrder(user!.userId, {
        addressId: selectedAddressId!,
        couponCode: couponCode ?? undefined,
        paymentMethod,
        shippingMethod,
      }),
    onSuccess: (order) => {
      clearAppliedCoupon();
      queryClient.invalidateQueries({ queryKey: ['cart', user?.userId] });
      queryClient.invalidateQueries({ queryKey: ['orders', user?.userId] });
      navigate(`/order-confirmation/${order.orderNumber}`);
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Couldn't place your order. Please try again.";
      setPlaceError(message);
    },
  });

  return (
    <div className="min-h-screen bg-navy-50">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <StepIndicator step={step} />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-lg border border-navy-100 bg-white p-6">
            {step === 0 && (
              <AddressStep
                userId={user!.userId}
                addresses={addressesQuery.data ?? []}
                isLoading={addressesQuery.isLoading}
                selectedAddressId={selectedAddressId}
                onSelect={setSelectedAddressId}
                onContinue={() => setStep(1)}
              />
            )}
            {step === 1 && (
              <ShippingStep
                address={selectedAddress}
                subtotal={subtotal}
                shippingMethod={shippingMethod}
                onChangeMethod={setShippingMethod}
                onBack={() => setStep(0)}
                onContinue={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <PaymentStep
                paymentMethod={paymentMethod}
                onChangeMethod={setPaymentMethod}
                cardName={cardName}
                setCardName={setCardName}
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                cardExpiry={cardExpiry}
                setCardExpiry={setCardExpiry}
                cardCvv={cardCvv}
                setCardCvv={setCardCvv}
                onBack={() => setStep(1)}
                onContinue={() => setStep(3)}
              />
            )}
            {step === 3 && (
              <ReviewStep
                address={selectedAddress}
                shippingMethod={shippingMethod}
                paymentMethod={paymentMethod}
                onBack={() => setStep(2)}
                onPlaceOrder={() => placeOrderMutation.mutate()}
                isPlacing={placeOrderMutation.isPending}
                error={placeError}
              />
            )}
          </div>

          <OrderSummary
            items={cartQuery.data?.items ?? []}
            subtotal={subtotal}
            shipping={step >= 1 ? shippingCost : null}
            couponCode={couponCode}
            discountAmount={discountAmount}
          />
        </div>
      </main>
    </div>
  );
}

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={clsx(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
                i < step
                  ? 'bg-gold-500 text-navy-950'
                  : i === step
                    ? 'border-2 border-gold-500 text-gold-600'
                    : 'border border-navy-100 text-navy-700/40'
              )}
            >
              {i < step ? '✓' : i + 1}
            </div>
            <span
              className={clsx(
                'text-[11px] font-semibold uppercase tracking-wide',
                i <= step ? 'text-navy-900' : 'text-navy-700/40'
              )}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={clsx('mx-2 mb-4 h-0.5 w-16', i < step ? 'bg-gold-500' : 'bg-navy-100')} />
          )}
        </div>
      ))}
    </div>
  );
}

function AddressStep({
  userId,
  addresses,
  isLoading,
  selectedAddressId,
  onSelect,
  onContinue,
}: {
  userId: number;
  addresses: AddressResponse[];
  isLoading: boolean;
  selectedAddressId: number | null;
  onSelect: (id: number) => void;
  onContinue: () => void;
}) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddressRequest>({
    street: '', city: '', province: '', postalCode: '', country: 'South Africa',
  });
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: () => createAddress(userId, form),
    onSuccess: (address) => {
      queryClient.invalidateQueries({ queryKey: ['addresses', userId] });
      onSelect(address.id);
      setShowForm(false);
      setForm({ street: '', city: '', province: '', postalCode: '', country: 'South Africa' });
    },
    onError: () => setError("Couldn't save that address. Check the fields and try again."),
  });

  const handleContinue = () => {
    if (!selectedAddressId) {
      setError('Please select or add a delivery address.');
      return;
    }
    onContinue();
  };

  return (
    <div>
      <h2 className="mb-4 font-display text-xl text-navy-900">Delivery Address</h2>

      {isLoading && <p className="text-sm text-navy-700/60">Loading addresses…</p>}

      {!isLoading && addresses.length > 0 && (
        <div className="space-y-2">
          {addresses.map((a) => (
            <label
              key={a.id}
              className={clsx(
                'flex cursor-pointer items-start gap-3 rounded border p-3 text-sm',
                selectedAddressId === a.id ? 'border-gold-500 bg-gold-100/30' : 'border-navy-100'
              )}
            >
              <input
                type="radio"
                checked={selectedAddressId === a.id}
                onChange={() => onSelect(a.id)}
                className="mt-1"
              />
              <span>
                <span className="block font-medium text-navy-900">{a.street}</span>
                <span className="block text-navy-700/70">
                  {a.city}{a.province ? `, ${a.province}` : ''} {a.postalCode}, {a.country}
                </span>
                {a.isDefault && (
                  <span className="mt-1 inline-block rounded bg-navy-100 px-1.5 py-0.5 text-[10px] font-semibold text-navy-700">
                    Default
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>
      )}

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mt-3 text-sm font-semibold text-navy-800 hover:underline"
        >
          + Add a new address
        </button>
      ) : (
        <div className="mt-4 rounded border border-navy-100 p-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              className="input col-span-2"
              placeholder="Street Address"
              value={form.street}
              onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
            />
            <input
              className="input"
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            />
            <select
              className="input"
              value={form.province}
              onChange={(e) => setForm((f) => ({ ...f, province: e.target.value }))}
            >
              <option value="">Select province…</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input
              className="input"
              placeholder="Postal Code"
              value={form.postalCode}
              onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
            />
            <input
              className="input"
              placeholder="Country"
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded border border-navy-100 px-3 py-1.5 text-xs font-semibold text-navy-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => createMutation.mutate()}
              disabled={
                createMutation.isPending ||
                !form.street || !form.city || !form.postalCode || !form.country
              }
              className="rounded bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
            >
              {createMutation.isPending ? 'Saving…' : 'Save Address'}
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-xs text-status-danger">{error}</p>}

      <button
        onClick={handleContinue}
        className="mt-6 w-full rounded bg-navy-900 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
      >
        Continue to Shipping
      </button>
    </div>
  );
}

function ShippingStep({
  address,
  subtotal,
  shippingMethod,
  onChangeMethod,
  onBack,
  onContinue,
}: {
  address: AddressResponse | null;
  subtotal: number;
  shippingMethod: ShippingMethod;
  onChangeMethod: (m: ShippingMethod) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div>
      <h2 className="mb-4 font-display text-xl text-navy-900">Shipping Method</h2>

      {address && (
        <div className="mb-4 flex items-start justify-between rounded bg-navy-50 p-3 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-700/60">
              Shipping To
            </p>
            <p className="text-navy-900">{address.street}</p>
            <p className="text-navy-700/70">
              {address.city}{address.province ? `, ${address.province}` : ''} {address.postalCode}
            </p>
          </div>
          <button onClick={onBack} className="text-xs font-semibold text-navy-800 hover:underline">
            Edit
          </button>
        </div>
      )}

      <div className="space-y-2">
        {SHIPPING_OPTIONS.map((opt) => {
          const cost = opt.value === 'STANDARD'
            ? (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 50)
            : SHIPPING_COSTS[opt.value];
          return (
            <label
              key={opt.value}
              className={clsx(
                'flex cursor-pointer items-center justify-between rounded border p-3 text-sm',
                shippingMethod === opt.value ? 'border-gold-500 bg-gold-100/30' : 'border-navy-100'
              )}
            >
              <span className="flex items-start gap-3">
                <input
                  type="radio"
                  checked={shippingMethod === opt.value}
                  onChange={() => onChangeMethod(opt.value)}
                  className="mt-1"
                />
                <span>
                  <span className="block font-medium text-navy-900">{opt.label}</span>
                  <span className="block text-xs text-navy-700/60">{opt.description}</span>
                </span>
              </span>
              <span className="font-semibold text-navy-900">
                {cost === 0 ? 'Free' : `R${cost.toFixed(2)}`}
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onBack}
          className="rounded border border-navy-100 px-4 py-2.5 text-sm font-semibold text-navy-800"
        >
          ← Back
        </button>
        <button
          onClick={onContinue}
          className="flex-1 rounded bg-navy-900 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}

function PaymentStep({
  paymentMethod,
  onChangeMethod,
  cardName, setCardName,
  cardNumber, setCardNumber,
  cardExpiry, setCardExpiry,
  cardCvv, setCardCvv,
  onBack,
  onContinue,
}: {
  paymentMethod: string;
  onChangeMethod: (m: string) => void;
  cardName: string; setCardName: (v: string) => void;
  cardNumber: string; setCardNumber: (v: string) => void;
  cardExpiry: string; setCardExpiry: (v: string) => void;
  cardCvv: string; setCardCvv: (v: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    if (paymentMethod === 'CARD' && (!cardName || !cardNumber || !cardExpiry || !cardCvv)) {
      setError('Please fill in all card details.');
      return;
    }
    onContinue();
  };

  return (
    <div>
      <h2 className="mb-1 font-display text-xl text-navy-900">Payment Method</h2>
      <p className="mb-4 text-xs text-navy-700/50">
        Demo checkout — no real payment is processed or stored.
      </p>

      <div className="space-y-2">
        {PAYMENT_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className={clsx(
              'block cursor-pointer rounded border p-3 text-sm',
              paymentMethod === opt.value ? 'border-gold-500 bg-gold-100/30' : 'border-navy-100'
            )}
          >
            <span className="flex items-center gap-3">
              <input
                type="radio"
                checked={paymentMethod === opt.value}
                onChange={() => onChangeMethod(opt.value)}
              />
              <span className="font-medium text-navy-900">{opt.label}</span>
            </span>

            {opt.value === 'CARD' && paymentMethod === 'CARD' && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <input
                  className="input col-span-2"
                  placeholder="Name on Card"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
                <input
                  className="input col-span-2"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="CVV"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                />
              </div>
            )}
          </label>
        ))}
      </div>

      {error && <p className="mt-3 text-xs text-status-danger">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button
          onClick={onBack}
          className="rounded border border-navy-100 px-4 py-2.5 text-sm font-semibold text-navy-800"
        >
          ← Back
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 rounded bg-navy-900 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}

function ReviewStep({
  address,
  shippingMethod,
  paymentMethod,
  onBack,
  onPlaceOrder,
  isPlacing,
  error,
}: {
  address: AddressResponse | null;
  shippingMethod: ShippingMethod;
  paymentMethod: string;
  onBack: () => void;
  onPlaceOrder: () => void;
  isPlacing: boolean;
  error: string | null;
}) {
  const shippingLabel = SHIPPING_OPTIONS.find((o) => o.value === shippingMethod)?.label;
  const paymentLabel = PAYMENT_OPTIONS.find((o) => o.value === paymentMethod)?.label;

  return (
    <div>
      <h2 className="mb-1 font-display text-xl text-navy-900">Review Your Order</h2>
      <p className="mb-4 text-xs text-navy-700/50">Please confirm the details below before placing your order.</p>

      <div className="grid grid-cols-2 gap-3">
        <ReviewCard title="Delivery Address">
          {address ? (
            <>
              <p>{address.street}</p>
              <p>{address.city}{address.province ? `, ${address.province}` : ''} {address.postalCode}</p>
              <p>{address.country}</p>
            </>
          ) : (
            <p>—</p>
          )}
        </ReviewCard>
        <ReviewCard title="Shipping">
          <p>{shippingLabel}</p>
        </ReviewCard>
        <ReviewCard title="Payment">
          <p>{paymentLabel}</p>
        </ReviewCard>
      </div>

      {error && <p className="mt-4 text-xs text-status-danger">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button
          onClick={onBack}
          className="rounded border border-navy-100 px-4 py-2.5 text-sm font-semibold text-navy-800"
        >
          ← Back
        </button>
        <button
          onClick={onPlaceOrder}
          disabled={isPlacing}
          className="flex-1 rounded bg-gold-500 py-2.5 text-sm font-semibold text-navy-950 hover:bg-gold-600 disabled:opacity-60"
        >
          {isPlacing ? 'Placing Order…' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}

function ReviewCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded border border-navy-100 p-3 text-sm text-navy-700">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-navy-700/60">{title}</p>
      {children}
    </div>
  );
}

function OrderSummary({
  items,
  subtotal,
  shipping,
  couponCode,
  discountAmount,
}: {
  items: { productName: string; quantity: number; subtotal: number; imageUrl: string | null }[];
  subtotal: number;
  shipping: number | null;
  couponCode: string | null;
  discountAmount: number;
}) {
  const total = Math.max(0, subtotal + (shipping ?? 0) - discountAmount);

  return (
    <div className="h-fit rounded-lg border border-navy-100 bg-white p-5">
      <h2 className="mb-4 font-display text-lg text-navy-900">Order Summary</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.productName} className="flex items-center gap-3 text-sm">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-navy-50">
              {item.imageUrl && <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="flex-1">
              <p className="text-navy-900">{item.productName}</p>
              <p className="text-xs text-navy-700/50">Qty {item.quantity}</p>
            </div>
            <p className="text-navy-900">R{item.subtotal.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-1 border-t border-navy-100 pt-3 text-sm">
        <div className="flex justify-between text-navy-700">
          <span>Subtotal</span>
          <span>R{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-navy-700">
          <span>Shipping</span>
          <span>{shipping == null ? 'Calculated at next step' : shipping === 0 ? 'Free' : `R${shipping.toFixed(2)}`}</span>
        </div>
        {couponCode && discountAmount > 0 && (
          <div className="flex justify-between text-status-success">
            <span>Promo: {couponCode}</span>
            <span>−R{discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-navy-100 pt-2 font-semibold text-navy-900">
          <span>Total</span>
          <span>R{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
