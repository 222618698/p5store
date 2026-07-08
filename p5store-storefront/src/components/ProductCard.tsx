import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { addCartItem } from '@/api/cart';
import { useWishlist } from '@/lib/wishlist';
import { StarRating } from '@/components/StarRating';
import type { ProductResponse } from '@/types';

export default function ProductCard({ product }: { product: ProductResponse }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { has, add, remove } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  const hasDiscount =
    product.compareAtPrice != null && product.compareAtPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100
      )
    : null;

  const inWishlist = has(product.id);

  const addToCartMutation = useMutation({
    mutationFn: () => addCartItem(user!.userId, product.id, 1),
    onSuccess: (data) => {
      queryClient.setQueryData(['cart', user?.userId], data);
      setCartError(null);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status;
      setCartError(
        status === 401 || status === 403
          ? 'Your session expired — please sign in again.'
          : "Couldn't add to cart. Try again."
      );
      setTimeout(() => setCartError(null), 3000);
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCartMutation.mutate();
  };

  return (
    <div className="group">
      <div className="relative mb-3 aspect-square overflow-hidden rounded bg-navy-50">
        <Link to={`/products/${product.id}`}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition group-hover:scale-105"
              onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-navy-700/30">
              No image
            </div>
          )}
        </Link>
        {discountPct != null && (
          <span className="absolute left-2 top-2 rounded bg-status-danger px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            -{discountPct}%
          </span>
        )}
        {!discountPct && product.badge && (
          <span className="absolute left-2 top-2 rounded bg-navy-950 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            {product.badge}
          </span>
        )}
        <button
          onClick={() => (inWishlist ? remove(product.id) : add(product))}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-navy-800 shadow-sm hover:bg-white"
        >
          <HeartIcon className="h-4 w-4" filled={inWishlist} />
        </button>
      </div>
      <Link to={`/products/${product.id}`}>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gold-600">
          {product.categoryName ?? product.brand ?? ''}
        </p>
        <p className="text-sm font-medium text-navy-900">{product.name}</p>
      </Link>
      {product.reviewCount > 0 && product.averageRating != null && (
        <div className="mt-1 flex items-center gap-1">
          <StarRating value={product.averageRating} size="h-3 w-3" />
          <span className="text-xs text-navy-700/50">({product.reviewCount})</span>
        </div>
      )}
      <div className="mt-1 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-navy-900">R{product.price.toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-xs text-navy-700/40 line-through">
              R{product.compareAtPrice!.toFixed(2)}
            </span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={addToCartMutation.isPending}
          aria-label="Add to cart"
          className="flex h-7 w-7 items-center justify-center rounded bg-navy-950 text-white hover:bg-navy-800 disabled:opacity-60"
        >
          {justAdded ? <CheckIcon className="h-3.5 w-3.5" /> : <CartIcon className="h-3.5 w-3.5" />}
        </button>
      </div>
      {cartError && <p className="mt-1 text-xs text-status-danger">{cartError}</p>}
    </div>
  );
}

function HeartIcon({ filled, ...props }: React.SVGProps<SVGSVGElement> & { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

function CartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.5 3h2l2.7 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L21.5 8H6" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
