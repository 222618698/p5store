// Mirrors com.p5store.dto.* records on the backend.
// Keep in sync with pillar5store2 backend DTOs.

export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';

export interface ProductResponse {
  id: number;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
  imageUrl: string | null;
  galleryImages: string[];
  brand: string | null;
  unit: string | null;
  badge: string | null;
  featured: boolean;
  status: ProductStatus;
  categoryName: string | null;
  categoryId: number | null;
  averageRating: number | null;
  reviewCount: number;
}

export interface CategoryResponse {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  parentId: number | null;
}

export interface ReviewResponse {
  id: number;
  rating: number;
  title: string | null;
  body: string | null;
  reviewerName: string;
  createdAt: string;
}

export interface RatingSummaryResponse {
  averageRating: number | null;
  reviewCount: number;
}

export interface ReviewRequest {
  userId: number;
  rating: number;
  title?: string;
  body?: string;
}

// Page<T> shape returned by Spring Data's Pageable
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface CartItemResponse {
  productId: number;
  productName: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface CartResponse {
  cartId: number;
  items: CartItemResponse[];
  total: number;
}

export interface CartItemRequest {
  productId: number;
  quantity: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderItemResponse {
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  shippingAddressSnapshot: string;
  shippingMethod: string;
  createdAt: string;
  items: OrderItemResponse[];
}

export type ShippingMethod = 'STANDARD' | 'EXPRESS' | 'SAME_DAY';

export interface PlaceOrderRequest {
  addressId: number;
  couponCode?: string;
  notes?: string;
  paymentMethod: string;
  shippingMethod?: ShippingMethod;
}

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  avatarUrl: string | null;
  newsletterOptIn: boolean;
  offersOptIn: boolean;
  smsOptIn: boolean;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  newsletterOptIn?: boolean;
  offersOptIn?: boolean;
  smsOptIn?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ContactMessageRequest {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

export interface ContactMessageResponse {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  createdAt: string;
}

export type AddressType = 'SHIPPING' | 'BILLING';

export interface AddressResponse {
  id: number;
  street: string;
  city: string;
  province: string | null;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: AddressType;
}

export interface AddressRequest {
  street: string;
  city: string;
  province?: string;
  postalCode: string;
  country: string;
  type?: AddressType;
  isDefault?: boolean;
}

export interface DiscountPreviewRequest {
  code: string;
  subtotal: number;
}

export interface DiscountPreviewResponse {
  valid: boolean;
  discountAmount: number;
  message: string;
}
