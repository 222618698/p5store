import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createProduct,
  getProductById,
  updateProduct,
  uploadProductImage,
} from '@/api/products';
import { getCategories } from '@/api/categories';
import { productSchema, type ProductFormValues } from './schema';
import type { ProductRequest } from '@/types';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const UNIT_OPTIONS = ['Each', 'Pair', 'Set', 'Box', 'kg', 'g', 'L', 'ml'];

type ProductFormInput = z.input<typeof productSchema>;

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const productId = id ? Number(id) : undefined;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const productQuery = useQuery({
    queryKey: ['products', productId],
    queryFn: () => getProductById(productId!),
    enabled: isEdit,
  });

  // Backend doesn't expose GET /v1/categories yet — see api/categories.ts.
  // This is written defensively so the form still works (as a manual
  // category ID input) until that endpoint ships.
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    retry: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      sku: '',
      price: 0,
      compareAtPrice: undefined,
      stockQuantity: 0,
      imageUrl: '',
      galleryImages: [],
      brand: '',
      unit: 'Each',
      badge: '',
      featured: false,
      active: true,
      categoryId: undefined,
    },
  });

  useEffect(() => {
    if (productQuery.data) {
      const p = productQuery.data;
      reset({
        name: p.name,
        description: p.description ?? '',
        sku: p.sku,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? undefined,
        stockQuantity: p.stockQuantity,
        imageUrl: p.imageUrl ?? '',
        galleryImages: p.galleryImages ?? [],
        brand: p.brand ?? '',
        unit: p.unit ?? 'Each',
        badge: p.badge ?? '',
        featured: p.featured,
        active: p.status !== 'INACTIVE',
        categoryId: p.categoryId ?? undefined,
      });
    }
  }, [productQuery.data, reset]);

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: uploadProductImage,
    onSuccess: (data) => {
      setValue('imageUrl', data.url, { shouldValidate: true });
      setUploadError(null);
    },
    onError: () => {
      setUploadError("Couldn't upload the image. Try again.");
    },
  });

  const galleryUploadMutation = useMutation({
    mutationFn: uploadProductImage,
    onSuccess: (data) => {
      setValue('galleryImages', [...(watch('galleryImages') ?? []), data.url]);
      setUploadError(null);
    },
    onError: () => {
      setUploadError("Couldn't upload the image. Try again.");
    },
  });

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return 'Unsupported format. Use JPG, PNG, or WEBP.';
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return 'Image is too large. Max size is 5MB.';
    }
    return null;
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }
    uploadMutation.mutate(file);
  };

  const handleGalleryFile = (file: File | undefined) => {
    if (!file) return;
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }
    galleryUploadMutation.mutate(file);
  };

  const removeGalleryImage = (url: string) => {
    setValue('galleryImages', (watch('galleryImages') ?? []).filter((u) => u !== url));
  };

  const saveMutation = useMutation({
    mutationFn: (payload: ProductRequest) =>
      isEdit ? updateProduct(productId!, payload) : createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/products');
    },
  });

  const onSubmit = (values: ProductFormValues) => {
    const payload: ProductRequest = {
      name: values.name,
      description: values.description || undefined,
      sku: values.sku,
      price: values.price,
      compareAtPrice:
        values.compareAtPrice === '' || values.compareAtPrice == null
          ? undefined
          : Number(values.compareAtPrice),
      stockQuantity: values.stockQuantity,
      imageUrl: values.imageUrl || undefined,
      galleryImages: values.galleryImages ?? [],
      brand: values.brand || undefined,
      unit: values.unit || undefined,
      badge: values.badge || undefined,
      featured: values.featured,
      active: values.active,
      categoryId: values.categoryId,
    };
    saveMutation.mutate(payload);
  };

  const imageUrl = watch('imageUrl');
  const galleryImages = watch('galleryImages') ?? [];

  if (isEdit && productQuery.isLoading) {
    return <p className="text-navy-700/60">Loading product…</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl"
      noValidate
    >
      {saveMutation.isError && (
        <div className="mb-4 rounded border border-status-danger/30 bg-red-50 px-3 py-2 text-sm text-status-danger">
          Couldn't save the product. Check the fields and try again.
        </div>
      )}

      <Section title="Product Information">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Product Name" error={errors.name?.message} full>
            <input className="input" placeholder="e.g. Premium Leather Briefcase" {...register('name')} />
          </Field>

          <Field label="SKU" error={errors.sku?.message}>
            <input className="input" placeholder="e.g. PLB-001-BRN" {...register('sku')} />
          </Field>

          <Field label="Brand" error={errors.brand?.message}>
            <input className="input" placeholder="e.g. Artisan Collective" {...register('brand')} />
          </Field>

          <Field label="Category" error={errors.categoryId?.message} full>
            {categoriesQuery.data && categoriesQuery.data.length > 0 ? (
              <select className="input" {...register('categoryId')}>
                <option value="">Select a category…</option>
                {categoriesQuery.data.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                className="input"
                placeholder="Category ID, e.g. 1"
                {...register('categoryId')}
              />
            )}
          </Field>
        </div>
        {!categoriesQuery.data?.length && (
          <p className="mt-2 text-xs text-navy-700/50">
            Category dropdown will populate once the backend exposes{' '}
            <code className="rounded bg-navy-50 px-1">GET /v1/categories</code>. Enter
            the numeric category ID for now.
          </p>
        )}
      </Section>

      <Section title="Pricing & Inventory">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Regular Price (R)" error={errors.price?.message}>
            <input type="number" step="0.01" className="input" placeholder="0.00" {...register('price')} />
          </Field>

          <Field label="Sale Price (R)" error={errors.compareAtPrice?.message}>
            <input
              type="number"
              step="0.01"
              className="input"
              placeholder="0.00"
              {...register('compareAtPrice')}
            />
          </Field>

          <Field label="Stock Quantity" error={errors.stockQuantity?.message}>
            <input type="number" className="input" placeholder="0" {...register('stockQuantity')} />
          </Field>

          <Field label="Badge" error={errors.badge?.message}>
            <input className="input" placeholder="e.g. New" {...register('badge')} />
          </Field>

          <Field label="Unit" error={errors.unit?.message}>
            <select className="input" {...register('unit')}>
              {UNIT_OPTIONS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Media">
        <input type="hidden" {...register('imageUrl')} />

        {imageUrl ? (
          <div className="flex items-start gap-4">
            <div className="h-32 w-32 shrink-0 overflow-hidden rounded border border-navy-100 bg-navy-50">
              <img
                src={imageUrl}
                alt="Preview"
                className="h-full w-full object-cover"
                onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded border border-navy-100 px-3 py-1.5 text-sm font-semibold text-navy-800 hover:bg-navy-50"
              >
                Replace image
              </button>
              <button
                type="button"
                onClick={() => setValue('imageUrl', '', { shouldValidate: true })}
                className="text-xs font-semibold text-status-danger hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className={
              'flex flex-col items-center justify-center rounded border-2 border-dashed px-4 py-10 text-center transition ' +
              (isDragging ? 'border-navy-600 bg-navy-50' : 'border-navy-100 bg-navy-50/40')
            }
          >
            <UploadIcon className="mb-2 h-8 w-8 text-navy-700/40" />
            {uploadMutation.isPending ? (
              <p className="text-sm text-navy-700/70">Uploading…</p>
            ) : (
              <>
                <p className="text-sm text-navy-700/70">Drag and drop an image here</p>
                <p className="text-xs text-navy-700/50">or click to browse from your computer</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 rounded bg-gold-500 px-4 py-1.5 text-sm font-semibold text-navy-950 hover:bg-gold-600"
                >
                  Browse Files
                </button>
              </>
            )}
            <p className="mt-3 text-xs text-navy-700/50">
              Supported formats: JPG, PNG, WEBP (Max size: 5MB per image)
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {(uploadError || errors.imageUrl?.message) && (
          <p className="mt-2 text-xs text-status-danger">
            {uploadError ?? errors.imageUrl?.message}
          </p>
        )}
      </Section>

      <Section title="Gallery Images">
        <p className="mb-3 text-xs text-navy-700/50">
          Additional photos shown in the product's image gallery on the storefront.
        </p>
        <div className="flex flex-wrap gap-3">
          {galleryImages.map((url) => (
            <div key={url} className="group relative h-24 w-24 overflow-hidden rounded border border-navy-100">
              <img src={url} alt="Gallery" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeGalleryImage(url)}
                className="absolute inset-0 flex items-center justify-center bg-navy-950/60 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            disabled={galleryUploadMutation.isPending}
            className="flex h-24 w-24 flex-col items-center justify-center rounded border-2 border-dashed border-navy-100 text-navy-700/50 hover:border-navy-600 hover:text-navy-700 disabled:opacity-60"
          >
            <UploadIcon className="mb-1 h-5 w-5" />
            <span className="text-[11px]">
              {galleryUploadMutation.isPending ? 'Uploading…' : 'Add Image'}
            </span>
          </button>
        </div>
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            handleGalleryFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </Section>

      <Section title="Description">
        <Field label="Product Description" error={errors.description?.message}>
          <textarea
            rows={4}
            className="input"
            placeholder="Enter detailed product description here…"
            {...register('description')}
          />
        </Field>
      </Section>

      <Section title="Visibility & Status" last>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-navy-900">Active Status</p>
            <p className="text-xs text-navy-700/60">Make this product visible in the store.</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" className="peer sr-only" {...register('active')} />
            <div className="h-6 w-11 rounded-full bg-navy-100 transition peer-checked:bg-gold-500" />
            <div className="absolute left-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
          </label>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-navy-900">
          <input type="checkbox" {...register('featured')} />
          Feature this product on the homepage and category headers
        </label>
      </Section>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="rounded border border-navy-100 px-4 py-2 text-sm font-semibold text-navy-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || saveMutation.isPending}
          className="rounded bg-navy-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:opacity-60"
        >
          {saveMutation.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
  last,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={
        'rounded-lg border border-navy-100 bg-white p-6 shadow-sm ' + (last ? '' : 'mb-4')
      }
    >
      <p className="mb-4 text-sm font-semibold text-navy-900">{title}</p>
      {children}
    </div>
  );
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M12 16V4M12 4 8 8M12 4l4 4" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function Field({
  label,
  error,
  children,
  full,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <label className="mb-1 block text-sm font-medium text-navy-900">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-status-danger">{error}</p>}
    </div>
  );
}
