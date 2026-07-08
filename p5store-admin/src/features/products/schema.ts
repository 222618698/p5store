import { z } from 'zod';

// Mirrors backend validation on com.p5store.dto.request.ProductRequest
export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  price: z.coerce.number().min(0.01, 'Price must be at least 0.01'),
  compareAtPrice: z.coerce.number().min(0).optional().or(z.literal('')),
  stockQuantity: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  imageUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  galleryImages: z.array(z.string()).optional(),
  brand: z.string().optional(),
  unit: z.string().optional(),
  badge: z.string().optional(),
  featured: z.boolean(),
  active: z.boolean(),
  categoryId: z.coerce.number({ message: 'Category is required' }).min(1, 'Category is required'),
});

export type ProductFormValues = z.infer<typeof productSchema>;
