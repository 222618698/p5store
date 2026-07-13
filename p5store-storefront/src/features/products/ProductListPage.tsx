import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { searchProducts, getProductsByCategory, getProducts, getNewArrivals } from '@/api/products';
import { getCategories } from '@/api/categories';

const PAGE_SIZE = 12;

type SortOption = 'best-match' | 'price-asc' | 'price-desc' | 'rating';

export default function ProductListPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const categoryParam = searchParams.get('category');
  const categoryId = categoryParam ? Number(categoryParam) : null;
  const isNewArrivals = searchParams.get('filter') === 'new';

  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('best-match');
  const [page, setPage] = useState(0);

  // Reset local filters/page whenever the query itself changes (new search or category).
  useEffect(() => {
    setSelectedCategories(categoryId ? new Set([categoryId]) : new Set());
    setSelectedBrands(new Set());
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
    setPage(0);
  }, [q, categoryId, isNewArrivals]);

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const resultsQuery = useQuery({
    queryKey: ['products', 'list', q, categoryId, isNewArrivals],
    queryFn: async () => {
      if (q) return searchProducts(q);
      if (categoryId) return getProductsByCategory(categoryId);
      if (isNewArrivals) return getNewArrivals();
      const page = await getProducts({ size: 100 });
      return page.content;
    },
  });

  const rawResults = resultsQuery.data ?? [];

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of rawResults) {
      if (p.categoryName) counts.set(p.categoryName, (counts.get(p.categoryName) ?? 0) + 1);
    }
    return counts;
  }, [rawResults]);

  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    for (const p of rawResults) if (p.brand) brands.add(p.brand);
    return Array.from(brands).sort();
  }, [rawResults]);

  const filtered = useMemo(() => {
    const categoryNames = new Set(
      Array.from(selectedCategories)
        .map((id) => categoriesQuery.data?.find((c) => c.id === id)?.name)
        .filter((name): name is string => !!name)
    );

    let results = rawResults.filter((p) => {
      if (categoryNames.size > 0 && !(p.categoryName && categoryNames.has(p.categoryName))) {
        return false;
      }
      if (selectedBrands.size > 0 && !(p.brand && selectedBrands.has(p.brand))) {
        return false;
      }
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      if (minRating > 0 && (p.averageRating ?? 0) < minRating) return false;
      return true;
    });

    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return (b.averageRating ?? 0) - (a.averageRating ?? 0);
        default:
          return 0;
      }
    });

    return results;
  }, [rawResults, selectedCategories, selectedBrands, minPrice, maxPrice, minRating, sortBy, categoriesQuery.data]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const heading = q
    ? `Search results for "${q}"`
    : isNewArrivals
      ? 'New Arrivals'
      : categoryFromList(categoriesQuery.data, categoryId);

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setPage(0);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(brand)) next.delete(brand);
      else next.add(brand);
      return next;
    });
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="font-display text-2xl text-navy-900">{heading}</h1>
        <p className="mt-1 text-sm text-navy-700/60">
          {resultsQuery.isLoading ? 'Searching…' : `${filtered.length} items found`}
        </p>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-56">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-navy-900">
              Filters
            </h2>

            <div className="mb-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-700/60">
                Category
              </p>
              <div className="space-y-1.5">
                {(categoriesQuery.data ?? []).map((c) => (
                  <label key={c.id} className="flex items-center gap-2 text-sm text-navy-800">
                    <input
                      type="checkbox"
                      checked={selectedCategories.has(c.id)}
                      onChange={() => toggleCategory(c.id)}
                    />
                    {c.name}
                    <span className="text-xs text-navy-700/40">
                      ({categoryCounts.get(c.name) ?? 0})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-700/60">
                Price Range
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="input w-full text-sm"
                />
                <span className="text-navy-700/40">–</span>
                <input
                  type="number"
                  min={0}
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="input w-full text-sm"
                />
              </div>
            </div>

            {availableBrands.length > 1 && (
              <div className="mb-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-700/60">
                  Brand
                </p>
                <div className="space-y-1.5">
                  {availableBrands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 text-sm text-navy-800">
                      <input
                        type="checkbox"
                        checked={selectedBrands.has(brand)}
                        onChange={() => toggleBrand(brand)}
                      />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-700/60">
                Rating
              </p>
              <select
                value={minRating}
                onChange={(e) => {
                  setMinRating(Number(e.target.value));
                  setPage(0);
                }}
                className="input w-full text-sm"
              >
                <option value={0}>Any rating</option>
                <option value={4}>4 stars &amp; up</option>
                <option value={3}>3 stars &amp; up</option>
                <option value={2}>2 stars &amp; up</option>
              </select>
            </div>

            <button
              onClick={() => setPage(0)}
              className="w-full rounded bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-600"
            >
              Apply Filters
            </button>
          </aside>

          <div className="flex-1">
            <div className="mb-4 flex justify-end">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="input w-48 text-sm"
              >
                <option value="best-match">Sort by: Best Match</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {resultsQuery.isLoading && <p className="text-sm text-navy-700/60">Loading…</p>}

            {!resultsQuery.isLoading && filtered.length === 0 && (
              <div className="rounded-lg border border-navy-100 bg-navy-50 p-10 text-center">
                <p className="text-sm text-navy-700/70">
                  No products matched{q ? ` "${q}"` : ' your filters'}. Try a different search or
                  adjust the filters.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {paged.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="rounded border border-navy-100 px-3 py-1.5 text-sm disabled:opacity-40"
                >
                  ‹
                </button>
                <span className="text-sm text-navy-700">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  className="rounded border border-navy-100 px-3 py-1.5 text-sm disabled:opacity-40"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function categoryFromList(
  categories: { id: number; name: string }[] | undefined,
  categoryId: number | null
): string {
  if (!categoryId) return 'All Products';
  return categories?.find((c) => c.id === categoryId)?.name ?? 'Products';
}
