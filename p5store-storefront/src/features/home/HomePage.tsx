import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getNewArrivals, getProducts } from '@/api/products';

export default function HomePage() {
  const newArrivalsQuery = useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: getNewArrivals,
  });

  const offersQuery = useQuery({
    queryKey: ['products', 'offers-sample'],
    queryFn: () => getProducts({ page: 0, size: 50 }),
  });

  const offers = useMemo(() => {
    const products = offersQuery.data?.content ?? [];
    return products
      .filter((p) => p.compareAtPrice != null && p.compareAtPrice > p.price)
      .slice(0, 4);
  }, [offersQuery.data]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <Hero />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl text-navy-900">New In</h2>
            <p className="text-sm text-navy-700/60">
              The latest additions to our curated collections.
            </p>
          </div>
          <Link
            to="/products?filter=new"
            className="text-sm font-semibold text-gold-600 hover:underline"
          >
            View All →
          </Link>
        </div>

        {newArrivalsQuery.isLoading && (
          <p className="text-sm text-navy-700/60">Loading…</p>
        )}
        {newArrivalsQuery.isError && (
          <p className="text-sm text-status-danger">
            Couldn't reach the backend. Confirm the Spring Boot app is running on{' '}
            <code className="rounded bg-navy-50 px-1">localhost:8080/store</code>.
          </p>
        )}
        {!newArrivalsQuery.isLoading &&
          !newArrivalsQuery.isError &&
          newArrivalsQuery.data?.length === 0 && (
            <p className="text-sm text-navy-700/60">
              No products yet — add some from the admin panel to see them here.
            </p>
          )}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {newArrivalsQuery.data?.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <CategoryBanners />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-6">
          <h2 className="font-display text-2xl text-navy-900">Latest Offers</h2>
          <p className="text-sm text-navy-700/60">
            Exceptional value on premium essentials.
          </p>
        </div>

        {!offersQuery.isLoading && offers.length === 0 && (
          <p className="text-sm text-navy-700/60">
            No discounted products right now — set a Sale Price lower than the
            Regular Price on a product in the admin panel to feature it here.
          </p>
        )}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {offers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="bg-navy-950 px-6 py-16 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="mb-4 inline-block rounded bg-gold-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-navy-950">
            Pillar 5 Guide
          </span>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            Above Average <span className="text-gold-400">Excellence</span>
          </h1>

          <button className="mt-6 rounded bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-gold-600">
            Shop Now →
          </button>
        </div>

        <div className="rounded-lg border border-navy-800 bg-navy-900/60 p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gold-400">
            Featured Curator
          </p>
          <p className="text-sm text-navy-100/80">
            Curated selections of high-end tech and lifestyle essentials.
          </p>
        </div>
      </div>
    </section>
  );
}

function CategoryBanners() {
  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          className="col-span-1 flex flex-col justify-end rounded-lg bg-cover bg-center p-8 sm:col-span-2"
          style={{
            backgroundImage:
              'linear-gradient(to top, rgba(14,32,56,0.85), rgba(14,32,56,0.35)), url(https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200&q=80)',
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-400">
            Curated Series
          </p>
          <h3 className="font-display text-2xl text-white">Elevated Living</h3>
          <p className="mb-4 text-sm text-navy-100/80">Curated for perfection</p>
          <button className="w-fit rounded bg-white px-4 py-2 text-sm font-semibold text-navy-950">
            Explore Collection
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div
            className="flex-1 rounded-lg bg-cover bg-center p-5"
            style={{
              backgroundImage:
                'linear-gradient(rgba(14,32,56,0.35), rgba(14,32,56,0.55)), url(https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80)',
            }}
          >
            <h3 className="font-display text-lg text-white">Radiance Beauty</h3>
            <p className="text-xs text-navy-100/80">Unlock the secret to radiant skin.</p>
          </div>
          <div
            className="flex-1 rounded-lg bg-cover bg-center p-5"
            style={{
              backgroundImage:
                'linear-gradient(rgba(14,32,56,0.35), rgba(14,32,56,0.55)), url(https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80)',
            }}
          >
            <h3 className="font-display text-lg text-white">Work Excellence</h3>
            <p className="text-xs text-navy-100/80">Tools designed for modern success.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
