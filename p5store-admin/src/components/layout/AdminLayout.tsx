import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/products/new': 'New Product',
  '/orders': 'Orders',
  '/customers': 'Customers',
  '/reports': 'Sales Reports',
  '/promo-codes': 'Promo Codes',
};

function resolveTitle(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith('/products/')) return 'Edit Product';
  if (pathname.startsWith('/orders/')) return 'Order Detail';
  return 'P5Store Admin';
}

export default function AdminLayout() {
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-navy-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={resolveTitle(pathname)} />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
