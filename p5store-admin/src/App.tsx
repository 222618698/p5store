import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/routes/ProtectedRoute';
import AdminLayout from '@/components/layout/AdminLayout';
import LoginPage from '@/features/auth/LoginPage';
import DashboardPage from '@/features/dashboard/DashboardPage';
import ProductListPage from '@/features/products/ProductListPage';
import ProductFormPage from '@/features/products/ProductFormPage';
import OrderLookupPage from '@/features/orders/OrderLookupPage';
import CustomersPage from '@/features/customers/CustomersPage';
import SalesReportsPage from '@/features/reports/SalesReportsPage';
import PromoCodesPage from '@/features/discounts/PromoCodesPage';
import ContactMessagesPage from '@/features/messages/ContactMessagesPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/products/new" element={<ProductFormPage />} />
                <Route path="/products/:id" element={<ProductFormPage />} />
                <Route path="/orders" element={<OrderLookupPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/reports" element={<SalesReportsPage />} />
                <Route path="/promo-codes" element={<PromoCodesPage />} />
                <Route path="/messages" element={<ContactMessagesPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
