import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { StarRating, StarRatingInput } from '@/components/StarRating';
import { useAuth } from '@/context/AuthContext';
import { getProducts, getProductById } from '@/api/products';
import { addCartItem } from '@/api/cart';
import { getProductReviews, submitReview } from '@/api/reviews';
import { useWishlist } from '@/lib/wishlist';

type Tab = 'description' | 'specifications' | 'reviews';

export default function ProductDetailPage() {
  const { id } = useParams();
  const productId = Number(id);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { has, add, remove } = useWishlist();
  const [tab, setTab] = useState<Tab>('description');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [cartError, setCartError] = useState<string | null>(null);

  const productQuery = useQuery({
    queryKey: ['products', productId],
    queryFn: () => getProductById(productId),
    enabled: !Number.isNaN(productId),
  });

  const similarQuery = useQuery({
    queryKey: ['products', 'similar', productQuery.data?.categoryId],
    queryFn: () => getProducts({ page: 0, size: 8 }),
    enabled: !!productQuery.data,
  });

  const reviewsQuery = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => getProductReviews(productId),
    enabled: !Number.isNaN(productId),
  });

  const addToCartMutation = useMutation({
    mutationFn: () => addCartItem(user!.userId, productId, quantity),
    onSuccess: (data) => {
      queryClient.setQueryData(['cart', user?.userId], data);
      setCartError(null);
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status;
      setCartError(
        status === 401 || status === 403
          ? 'Your session expired — please sign in again.'
          : "Couldn't add to cart. Try again."
      );
    },
  });

  if (productQuery.isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <p className="p-12 text-center text-sm text-navy-700/60">Loading…</p>
      </div>
    );
  }

  if (productQuery.isError || !productQuery.data) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <p className="p-12 text-center text-sm text-status-danger">Product not found.</p>
      </div>
    );
  }

  const product = productQuery.data;
  const inWishlist = has(product.id);
  const similar = (similarQuery.data?.content ?? [])
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 4);
  const gallery = [product.imageUrl, ...product.galleryImages].filter(Boolean) as string[];
  const mainImage = activeImage ?? gallery[0] ?? null;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCartMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <nav className="mb-6 text-xs text-navy-700/60">
          <Link to="/" className="hover:underline">Home</Link>
          {product.categoryName && (
            <>
              {' / '}
              <span>{product.categoryName}</span>
            </>
          )}
          {' / '}
          <span className="text-navy-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <div className="aspect-square overflow-hidden rounded-lg bg-navy-50">
              {mainImage ? (
                <img src={mainImage} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-navy-700/30">
                  No image
                </div>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 flex gap-2">
                {gallery.map((url) => (
                  <button
                    key={url}
                    onClick={() => setActiveImage(url)}
                    className={clsx(
                      'h-16 w-16 overflow-hidden rounded border-2',
                      (activeImage ?? gallery[0]) === url ? 'border-gold-500' : 'border-transparent'
                    )}
                  >
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-navy-700/50">SKU: {product.sku}</p>
              {product.reviewCount > 0 && product.averageRating != null && (
                <div className="flex items-center gap-1.5">
                  <StarRating value={product.averageRating} />
                  <span className="text-xs text-navy-700/60">
                    {product.averageRating.toFixed(1)} ({product.reviewCount} Review
                    {product.reviewCount === 1 ? '' : 's'})
                  </span>
                </div>
              )}
            </div>
            <h1 className="mt-1 font-display text-3xl text-navy-900">{product.name}</h1>

            <div className="mt-4 flex items-center gap-3">
              <p className="font-display text-2xl text-navy-900">R{product.price.toFixed(2)}</p>
              {product.compareAtPrice != null && product.compareAtPrice > product.price && (
                <p className="text-sm text-navy-700/40 line-through">
                  R{product.compareAtPrice.toFixed(2)}
                </p>
              )}
              <span
                className={clsx(
                  'ml-2 text-xs font-semibold',
                  product.status === 'OUT_OF_STOCK' ? 'text-status-danger' : 'text-status-success'
                )}
              >
                {product.status === 'OUT_OF_STOCK' ? 'Out of Stock' : 'In Stock'}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded border border-navy-100">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-10 w-10 text-navy-700 hover:bg-navy-50"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-10 w-10 text-navy-700 hover:bg-navy-50"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending || product.status === 'OUT_OF_STOCK'}
                className="flex-1 rounded bg-navy-900 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-50"
              >
                {addToCartMutation.isPending ? 'Adding…' : 'Add to Cart'}
              </button>
              <button
                onClick={() => (inWishlist ? remove(product.id) : add(product))}
                className="flex h-10 w-10 items-center justify-center rounded border border-navy-100 text-navy-800 hover:bg-navy-50"
              >
                <HeartIcon className="h-4 w-4" filled={inWishlist} />
              </button>
            </div>

            {addToCartMutation.isSuccess && !cartError && (
              <p className="mt-2 text-xs font-medium text-status-success">Added to your cart.</p>
            )}
            {cartError && (
              <p className="mt-2 text-xs font-medium text-status-danger">{cartError}</p>
            )}

            <div className="mt-4 flex items-center gap-2 text-xs text-navy-700/60">
              <TruckIcon className="h-4 w-4" />
              <span>Delivery methods can vary by region.</span>
            </div>

            <div className="mt-8 border-b border-navy-100">
              <div className="flex gap-6 text-sm font-medium">
                {(['description', 'specifications', 'reviews'] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={clsx(
                      'border-b-2 py-2 capitalize transition',
                      tab === t
                        ? 'border-gold-500 text-navy-900'
                        : 'border-transparent text-navy-700/50 hover:text-navy-800'
                    )}
                  >
                    {t === 'reviews' ? `Customer Reviews (${product.reviewCount})` : t}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-5 text-sm text-navy-700/80">
              {tab === 'description' && (
                <p>{product.description || 'No description available for this product yet.'}</p>
              )}
              {tab === 'specifications' && (
                <table className="w-full text-sm">
                  <tbody>
                    <SpecRow label="Brand" value={product.brand ?? '—'} />
                    <SpecRow label="Category" value={product.categoryName ?? '—'} />
                    <SpecRow label="Unit" value={product.unit ?? '—'} />
                    <SpecRow label="SKU" value={product.sku} />
                  </tbody>
                </table>
              )}
              {tab === 'reviews' && (
                <ReviewsTab productId={productId} reviews={reviewsQuery.data ?? []} />
              )}
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 font-display text-2xl text-navy-900">Similar Products</h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {similar.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

function ReviewsTab({
  productId,
  reviews,
}: {
  productId: number;
  reviews: { id: number; rating: number; title: string | null; body: string | null; reviewerName: string; createdAt: string }[];
}) {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submitMutation = useMutation({
    mutationFn: () =>
      submitReview(productId, { userId: user!.userId, rating, title, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['products', productId] });
      setRating(0);
      setTitle('');
      setBody('');
      setError(null);
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Couldn't submit your review.";
      setError(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    submitMutation.mutate();
  };

  return (
    <div>
      {reviews.length === 0 ? (
        <p className="text-navy-700/60">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-navy-100 pb-4 last:border-0">
              <div className="mb-1 flex items-center gap-2">
                <StarRating value={r.rating} />
                <span className="text-xs font-semibold text-navy-900">{r.reviewerName}</span>
                <span className="text-xs text-navy-700/40">
                  {new Date(r.createdAt).toLocaleDateString('en-ZA', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                </span>
              </div>
              {r.title && <p className="text-sm font-medium text-navy-900">{r.title}</p>}
              {r.body && <p className="text-sm text-navy-700/70">{r.body}</p>}
            </div>
          ))}
        </div>
      )}

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-navy-100 p-4">
          <p className="mb-3 text-sm font-semibold text-navy-900">Write a Review</p>
          {error && <p className="mb-3 text-xs text-status-danger">{error}</p>}
          {submitMutation.isSuccess && !error && (
            <p className="mb-3 text-xs text-status-success">Thanks for your review!</p>
          )}
          <StarRatingInput value={rating} onChange={setRating} />
          <input
            className="input mt-3"
            placeholder="Review title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="input mt-2"
            rows={3}
            placeholder="Share your thoughts on this product…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <button
            type="submit"
            disabled={submitMutation.isPending}
            className="mt-3 rounded bg-navy-900 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
          >
            {submitMutation.isPending ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>
      ) : (
        <p className="mt-4 text-xs text-navy-700/50">
          <Link to="/login" className="font-semibold text-navy-800 hover:underline">Sign in</Link>{' '}
          to write a review.
        </p>
      )}
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-navy-100 last:border-0">
      <td className="py-2 pr-4 font-medium text-navy-900">{label}</td>
      <td className="py-2 text-navy-700/70">{value}</td>
    </tr>
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

function TruckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </svg>
  );
}
