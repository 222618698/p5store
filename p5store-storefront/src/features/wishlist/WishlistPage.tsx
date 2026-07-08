import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/lib/wishlist';

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { items } = useWishlist();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        {items.length === 0 ? (
          <div className="mx-auto max-w-md rounded-lg bg-navy-50 px-8 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <HeartIcon className="h-7 w-7 text-navy-700/50" />
            </div>
            <h1 className="mb-2 font-display text-2xl text-navy-900">Your Wishlist Awaits</h1>
            <p className="mb-6 text-sm text-navy-700/60">
              Curate your personal collection of high-end finds. Save the pieces that
              inspire you and return to them when the moment is right.
            </p>
            <button
              onClick={() => navigate('/')}
              className="rounded bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-gold-600"
            >
              Discover New Arrivals →
            </button>
            <div className="mt-4 flex justify-center gap-4 text-xs font-medium text-navy-700">
              {!isAuthenticated && (
                <Link to="/login" className="hover:underline">Sign In to sync</Link>
              )}
              <Link to="/" className="hover:underline">View Best Sellers</Link>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="mb-6 font-display text-2xl text-navy-900">Your Wishlist</h1>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
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
