import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import HomePage from '@/features/home/HomePage';
import AuthPage from '@/features/auth/AuthPage';
import ForgotPasswordPage from '@/features/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/features/auth/ResetPasswordPage';
import ResetSuccessPage from '@/features/auth/ResetSuccessPage';
import CartPage from '@/features/cart/CartPage';
import WishlistPage from '@/features/wishlist/WishlistPage';
import ProductDetailPage from '@/features/products/ProductDetailPage';
import ProductListPage from '@/features/products/ProductListPage';
import AccountLayout from '@/features/account/AccountLayout';
import AccountDashboardPage from '@/features/account/AccountDashboardPage';
import AccountOrdersPage from '@/features/account/AccountOrdersPage';
import AccountAddressesPage from '@/features/account/AccountAddressesPage';
import AccountSettingsPage from '@/features/account/AccountSettingsPage';
import ComingSoonPage from '@/features/account/ComingSoonPage';
import CheckoutPage from '@/features/checkout/CheckoutPage';
import OrderConfirmationPage from '@/features/checkout/OrderConfirmationPage';
import PayPalReturnPage from '@/features/checkout/PayPalReturnPage';
import AboutPage from '@/features/company/AboutPage';
import PrivacyPolicyPage from '@/features/company/PrivacyPolicyPage';
import ContactPage from '@/features/company/ContactPage';

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
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/reset-password/success" element={<ResetSuccessPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
            <Route path="/paypal/return" element={<PayPalReturnPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route path="/account" element={<AccountLayout />}>
              <Route index element={<AccountDashboardPage />} />
              <Route path="orders" element={<AccountOrdersPage />} />
              <Route path="profile" element={<ComingSoonPage title="My Profile" />} />
              <Route path="addresses" element={<AccountAddressesPage />} />
              <Route path="payment" element={<ComingSoonPage title="Payment Methods" />} />
              <Route path="settings" element={<AccountSettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
