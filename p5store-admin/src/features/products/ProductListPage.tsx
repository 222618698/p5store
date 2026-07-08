import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { deleteProduct, getProducts, searchProducts } from '@/api/products';
import StatusBadge from '@/components/ui/StatusBadge';
import type { ProductResponse, ProductStatus } from '@/types';

const PAGE_SIZE = 10;

export default function ProductListPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ProductStatus>('ALL');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const queryClient = useQueryClient();

  // simple debounce without extra deps
  const onSearchChange = (value: string) => {
    setSearch(value);
    window.clearTimeout((onSearchChange as any)._t);
    (onSearchChange as any)._t = window.setTimeout(() => {
      setDebouncedSearch(value);
      setPage(0);
    }, 350);
  };

  const isSearching = debouncedSearch.trim().length > 0;

  const pagedQuery = useQuery({
    queryKey: ['products', page],
    queryFn: () => getProducts({ page, size: PAGE_SIZE, sort: 'name,asc' }),
    enabled: !isSearching,
  });

  const searchQuery = useQuery({
    queryKey: ['products', 'search', debouncedSearch],
    queryFn: () => searchProducts(debouncedSearch),
    enabled: isSearching,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleDelete = (product: ProductResponse) => {
    if (window.confirm(`Delete "${product.name}"? This can't be undone.`)) {
      deleteMutation.mutate(product.id);
    }
  };

  const rawProducts: ProductResponse[] = isSearching
    ? searchQuery.data ?? []
    : pagedQuery.data?.content ?? [];

  const isLoading = isSearching ? searchQuery.isLoading : pagedQuery.isLoading;
  const isError = isSearching ? searchQuery.isError : pagedQuery.isError;

  // Filters below apply client-side to whichever set is currently loaded
  // (search results or the current page) — the backend has no combined
  // search+filter endpoint yet.
  const categoryOptions = useMemo(() => {
    const names = new Set(rawProducts.map((p) => p.categoryName).filter(Boolean));
    return Array.from(names) as string[];
  }, [rawProducts]);

  const products = useMemo(() => {
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;
    return rawProducts.filter((p) => {
      if (categoryFilter !== 'ALL' && p.categoryName !== categoryFilter) return false;
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
      if (min != null && p.price < min) return false;
      if (max != null && p.price > max) return false;
      return true;
    });
  }, [rawProducts, categoryFilter, statusFilter, minPrice, maxPrice]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products by name…"
          className="w-72 rounded border border-navy-100 bg-white px-3 py-2 text-sm outline-none focus:border-navy-600 focus:ring-1 focus:ring-navy-600"
        />
        <Link
          to="/products/new"
          className="rounded bg-navy-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-700"
        >
          + New Product
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded border border-navy-100 bg-white px-3 py-2 text-sm outline-none focus:border-navy-600 focus:ring-1 focus:ring-navy-600"
        >
          <option value="ALL">All categories</option>
          {categoryOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded border border-navy-100 bg-white px-3 py-2 text-sm outline-none focus:border-navy-600 focus:ring-1 focus:ring-navy-600"
        >
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>

        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min R"
            className="w-24 rounded border border-navy-100 bg-white px-3 py-2 text-sm outline-none focus:border-navy-600 focus:ring-1 focus:ring-navy-600"
          />
          <span className="text-navy-700/50">–</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max R"
            className="w-24 rounded border border-navy-100 bg-white px-3 py-2 text-sm outline-none focus:border-navy-600 focus:ring-1 focus:ring-navy-600"
          />
        </div>

        {(categoryFilter !== 'ALL' || statusFilter !== 'ALL' || minPrice || maxPrice) && (
          <button
            onClick={() => {
              setCategoryFilter('ALL');
              setStatusFilter('ALL');
              setMinPrice('');
              setMaxPrice('');
            }}
            className="text-xs font-semibold text-navy-700 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-navy-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-navy-100 bg-navy-50 text-xs uppercase tracking-wide text-navy-700/70">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-navy-700/60">
                  Loading products…
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-status-danger">
                  Couldn't load products. Is the backend running on{' '}
                  <code className="rounded bg-navy-50 px-1">localhost:8080/store</code>?
                </td>
              </tr>
            )}
            {!isLoading && !isError && products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-navy-700/60">
                  No products found.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-b border-navy-100 last:border-0 hover:bg-navy-50/60">
                <td className="flex items-center gap-3 px-4 py-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-navy-100">
                    {p.imageUrl && (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="h-full w-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-navy-900">{p.name}</p>
                    {p.featured && (
                      <span className="text-xs font-semibold text-gold-600">Featured</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-navy-700">{p.sku}</td>
                <td className="px-4 py-3 text-navy-700">{p.categoryName ?? '—'}</td>
                <td className="px-4 py-3 text-navy-900">R{p.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-navy-700">{p.stockQuantity}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/products/${p.id}`}
                    className="mr-3 text-xs font-semibold text-navy-800 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p)}
                    className="text-xs font-semibold text-status-danger hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isSearching && pagedQuery.data && pagedQuery.data.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-navy-700">
          <span>
            Page {pagedQuery.data.number + 1} of {pagedQuery.data.totalPages} ·{' '}
            {pagedQuery.data.totalElements} products
          </span>
          <div className="flex gap-2">
            <button
              disabled={pagedQuery.data.first}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded border border-navy-100 px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={pagedQuery.data.last}
              onClick={() => setPage((p) => p + 1)}
              className="rounded border border-navy-100 px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
