// Carries the applied promo code from the Cart page into Checkout.
// Session-scoped only — cleared once the order is placed.
const KEY = 'p5store_checkout_coupon';

export function getAppliedCoupon(): string | null {
  return sessionStorage.getItem(KEY);
}

export function setAppliedCoupon(code: string) {
  sessionStorage.setItem(KEY, code);
}

export function clearAppliedCoupon() {
  sessionStorage.removeItem(KEY);
}
