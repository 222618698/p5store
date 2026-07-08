// Mirrors com.p5store.dto.* records on the backend.
// Keep in sync with pillar5store2 backend DTOs.

export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface AuthResponse {
  token: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
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

export interface ProductRequest {
  name: string;
  description?: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  stockQuantity: number;
  imageUrl?: string;
  galleryImages?: string[];
  brand?: string;
  unit?: string;
  badge?: string;
  featured: boolean;
  active?: boolean;
  categoryId: number;
}

// Page<T> shape returned by Spring Data's Pageable
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page index (0-based)
  size: number;
  first: boolean;
  last: boolean;
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
  createdAt: string;
  items: OrderItemResponse[];
}

// NOTE: There is no CategoryController in the backend yet, only a
// CategoryRepository. This type + the /v1/categories calls in
// api/categories.ts are written to match SecurityConfig's existing
// "/v1/categories/**" permitAll rule, anticipating that endpoint.
// See README "Backend gaps" section.
export interface CategoryResponse {
  id: number;
  name: string;
}

export type DiscountType = 'PERCENTAGE' | 'FLAT';

export interface DiscountResponse {
  id: string;
  code: string;
  discountType: DiscountType;
  value: number;
  usageLimit: number | null;
  usageCount: number;
  validTo: string | null;
  active: boolean;
}

export interface DiscountRequest {
  code: string;
  discountType: DiscountType;
  value: number;
  usageLimit?: number | null;
  validTo?: string | null;
  active?: boolean;
}
