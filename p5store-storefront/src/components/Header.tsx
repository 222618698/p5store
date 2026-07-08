import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { getCart } from '@/api/cart';
import { useWishlist } from '@/lib/wishlist';
import logo from '@/assets/logo.png';

const NAV_LINKS = ['New Arrivals', 'Best Sellers', 'Designers', 'Brands'];
const CATEGORY_LINKS = ['Electronics', 'Home & Living', 'Beauty', 'Fashion', 'Sports'];

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();

  const cartQuery = useQuery({
    queryKey: ['cart', user?.userId],
    queryFn: () => getCart(user!.userId),
    enabled: isAuthenticated,
  });
  const cartCount = cartQuery.data?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <header className="border-b border-navy-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3">
        <Link to="/" className="flex shrink-0 items-center">
          <img src={logo} alt="Pillar 5" className="h-16 w-auto object-contain" />
        </Link>

        <nav className="hidden flex-1 items-center gap-6 text-sm font-medium text-navy-800 md:flex">
          {NAV_LINKS.map((label) => (
            <a key={label} href="#" className="hover:text-navy-600">
              {label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden items-center rounded border border-navy-100 px-3 py-1.5 sm:flex">
            <input
              type="search"
              placeholder="Search for luxury goods..."
              className="w-48 text-sm outline-none placeholder:text-navy-700/40"
            />
            <SearchIcon className="h-4 w-4 shrink-0 text-navy-700/50" />
          </div>

          <Link to="/wishlist" className="relative text-navy-800 hover:text-navy-600">
            <HeartIcon className="h-5 w-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-navy-950">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <Link to="/account" className="text-navy-800 hover:text-navy-600">
              <UserIcon className="h-5 w-5" />
            </Link>
          ) : (
            <Link to="/login" className="text-navy-800 hover:text-navy-600">
              <UserIcon className="h-5 w-5" />
            </Link>
          )}

          {isAuthenticated && (
            <button
              onClick={logout}
              className="text-sm font-medium text-navy-800 hover:text-navy-600"
            >
              Log Out
            </button>
          )}

          <Link to="/cart" className="relative text-navy-800 hover:text-navy-600">
            <CartIcon className="h-5 w-5" />
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-navy-950">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      <div className="border-t border-navy-100">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-2 text-xs font-medium uppercase tracking-wide text-navy-700/70">
          {CATEGORY_LINKS.map((label) => (
            <a key={label} href="#" className="hover:text-navy-900">
              {label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
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
