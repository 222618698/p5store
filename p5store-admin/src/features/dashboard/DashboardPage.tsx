import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { getProducts } from '@/api/products';
import StatCard from '@/components/ui/StatCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const NAVY = '#1b3a6b';
const DANGER = '#b3261e';
const INFO = '#2d5aa0';

export default function DashboardPage() {
  // Pulls a large page of products client-side to derive stats/charts.
  // There's no dedicated admin stats endpoint yet — see README for the
  // list of backend endpoints an admin dashboard like this really needs
  // (order totals/revenue, low-stock alerts, etc. all belong server-side
  // once the catalog grows past a page or two).
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', 'dashboard-sample'],
    queryFn: () => getProducts({ page: 0, size: 200 }),
  });

  const stats = useMemo(() => {
    const products = data?.content ?? [];
    const lowStock = products.filter((p) => p.stockQuantity <= 5).length;
    const outOfStock = products.filter((p) => p.status === 'OUT_OF_STOCK').length;
    const featured = products.filter((p) => p.featured).length;
    const byCategory = new Map<string, number>();
    for (const p of products) {
      const key = p.categoryName ?? 'Uncategorised';
      byCategory.set(key, (byCategory.get(key) ?? 0) + 1);
    }
    const byStatus = { ACTIVE: 0, INACTIVE: 0, OUT_OF_STOCK: 0 };
    for (const p of products) {
      byStatus[p.status] = (byStatus[p.status] ?? 0) + 1;
    }
    return {
      total: data?.totalElements ?? products.length,
      lowStock,
      outOfStock,
      featured,
      byCategory,
      byStatus,
    };
  }, [data]);

  return (
    <div>
      {isError && (
        <div className="mb-6 rounded border border-status-danger/30 bg-red-50 px-4 py-3 text-sm text-status-danger">
          Couldn't reach the backend. Confirm the Spring Boot app is running on{' '}
          <code className="rounded bg-white px-1">localhost:8080/store</code>.
        </div>
      )}

      <div className="mb-6 grid grid-cols-4 gap-4">
        <StatCard label="Total Products" value={isLoading ? '—' : String(stats.total)} />
        <StatCard
          label="Featured"
          value={isLoading ? '—' : String(stats.featured)}
          accent="gold"
        />
        <StatCard
          label="Low Stock (≤5)"
          value={isLoading ? '—' : String(stats.lowStock)}
          hint="Consider restocking soon"
        />
        <StatCard
          label="Out of Stock"
          value={isLoading ? '—' : String(stats.outOfStock)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-navy-100 bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-semibold text-navy-900">
            Products by Category
          </p>
          {!isLoading && stats.byCategory.size > 0 ? (
            <Bar
              data={{
                labels: Array.from(stats.byCategory.keys()),
                datasets: [
                  {
                    label: 'Products',
                    data: Array.from(stats.byCategory.values()),
                    backgroundColor: NAVY,
                    borderRadius: 4,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
              }}
            />
          ) : (
            <p className="text-sm text-navy-700/60">No product data yet.</p>
          )}
        </div>

        <div className="rounded-lg border border-navy-100 bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-semibold text-navy-900">
            Catalog Status Breakdown
          </p>
          {!isLoading && stats.total > 0 ? (
            <Doughnut
              data={{
                labels: ['Active', 'Inactive', 'Out of Stock'],
                datasets: [
                  {
                    data: [
                      stats.byStatus.ACTIVE,
                      stats.byStatus.INACTIVE,
                      stats.byStatus.OUT_OF_STOCK,
                    ],
                    backgroundColor: [NAVY, INFO, DANGER],
                  },
                ],
              }}
              options={{ plugins: { legend: { position: 'bottom' } } }}
            />
          ) : (
            <p className="text-sm text-navy-700/60">No product data yet.</p>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gold-500/40 bg-gold-100/40 p-4 text-sm text-navy-900">
        <strong>Coming next:</strong> revenue and orders-over-time charts once the
        backend adds an admin orders list/stats endpoint (see{' '}
        <code className="rounded bg-white px-1">api/orders.ts</code> for the current
        gap).
      </div>
    </div>
  );
}
