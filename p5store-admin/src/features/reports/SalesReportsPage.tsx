import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import clsx from 'clsx';
import StatCard from '@/components/ui/StatCard';
import { mockReports, type ReportRange } from './mockReports';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const NAVY = '#1b3a6b';
const GOLD = '#c9a227';

const RANGES: { key: ReportRange; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7 Days' },
  { key: 'month', label: 'This Month' },
];

export default function SalesReportsPage() {
  const [range, setRange] = useState<ReportRange>('7d');
  const data = mockReports[range];
  const peakIndex = data.revenueTrend.reduce(
    (best, point, i) => (point.value > data.revenueTrend[best].value ? i : best),
    0
  );

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl text-navy-900">Sales Reports</h1>
          <p className="mt-1 text-sm text-navy-700/70">
            Comprehensive overview of revenue and performance.
          </p>
        </div>
        <div className="flex gap-2">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={clsx(
                'rounded px-3 py-1.5 text-sm font-semibold transition',
                range === r.key
                  ? 'bg-navy-800 text-white'
                  : 'border border-navy-100 bg-white text-navy-800 hover:bg-navy-50'
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue (ZAR)"
          value={`R${data.totalRevenue.toLocaleString('en-ZA')}`}
        />
        <StatCard
          label="Gross Profit"
          value={`R${data.grossProfit.toLocaleString('en-ZA')}`}
          accent="gold"
        />
        <StatCard
          label="Avg Order Value"
          value={`R${data.avgOrderValue.toLocaleString('en-ZA')}`}
        />
        <StatCard
          label="Sales Growth"
          value={`${data.salesGrowthPct > 0 ? '+' : ''}${data.salesGrowthPct.toFixed(1)}%`}
          hint={
            data.salesGrowthPct >= 0
              ? 'vs. last period'
              : 'vs. last period — down'
          }
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-lg border border-navy-100 bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-semibold text-navy-900">Revenue Trend</p>
          <Bar
            data={{
              labels: data.revenueTrend.map((p) => p.label),
              datasets: [
                {
                  label: 'Revenue',
                  data: data.revenueTrend.map((p) => p.value),
                  backgroundColor: data.revenueTrend.map((_, i) =>
                    i === peakIndex ? GOLD : NAVY
                  ),
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
        </div>

        <div className="rounded-lg border border-navy-100 bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-semibold text-navy-900">Top Products</p>
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-navy-700/70">
              <tr>
                <th className="pb-2">Product</th>
                <th className="pb-2 text-right">Qty</th>
                <th className="pb-2 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.topProducts.map((p) => (
                <tr key={p.name} className="border-t border-navy-100">
                  <td className="py-2 pr-2 text-navy-900">{p.name}</td>
                  <td className="py-2 text-right text-navy-700">{p.qty}</td>
                  <td className="py-2 text-right text-navy-900">
                    R{p.revenue.toLocaleString('en-ZA')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
