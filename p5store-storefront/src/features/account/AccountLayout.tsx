import { NavLink, Navigate, Outlet } from 'react-router-dom';
import clsx from 'clsx';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

const NAV_ITEMS = [
  { to: '/account', label: 'My Account', end: true },
  { to: '/account/profile', label: 'My Profile' },
  { to: '/account/orders', label: 'Order History' },
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/account/addresses', label: 'Addresses' },
  { to: '/account/payment', label: 'Payment Methods' },
  { to: '/account/settings', label: 'Settings' },
];

export default function AccountLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-6 py-10">
        <aside className="w-56 shrink-0">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  clsx(
                    'block rounded px-3 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-navy-900 text-gold-400'
                      : 'text-navy-800 hover:bg-navy-50'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
