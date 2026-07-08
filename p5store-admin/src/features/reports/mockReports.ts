// Placeholder data. There's no orders-list or revenue/analytics endpoint on
// the backend yet — see OrderController (only single-order lookup + status
// update). Swap this out for a real api/reports.ts call once that ships.
export type ReportRange = 'today' | '7d' | 'month';

export interface ReportDataset {
  totalRevenue: number;
  grossProfit: number;
  avgOrderValue: number;
  salesGrowthPct: number;
  revenueTrend: { label: string; value: number }[];
  topProducts: { name: string; qty: number; revenue: number }[];
}

export const mockReports: Record<ReportRange, ReportDataset> = {
  today: {
    totalRevenue: 18400,
    grossProfit: 6600,
    avgOrderValue: 920,
    salesGrowthPct: 4.2,
    revenueTrend: [
      { label: '8am', value: 800 },
      { label: '10am', value: 1900 },
      { label: '12pm', value: 3400 },
      { label: '2pm', value: 2600 },
      { label: '4pm', value: 4100 },
      { label: '6pm', value: 3900 },
      { label: '8pm', value: 1700 },
    ],
    topProducts: [
      { name: 'Premium Leather Tote', qty: 12, revenue: 5100 },
      { name: 'Cashmere Scarf', qty: 9, revenue: 3200 },
      { name: 'Signature Watch', qty: 4, revenue: 4800 },
    ],
  },
  '7d': {
    totalRevenue: 124500,
    grossProfit: 45200,
    avgOrderValue: 5450,
    salesGrowthPct: 14.5,
    revenueTrend: [
      { label: 'Mon', value: 14000 },
      { label: 'Tue', value: 17500 },
      { label: 'Wed', value: 22000 },
      { label: 'Thu', value: 15200 },
      { label: 'Fri', value: 19800 },
      { label: 'Sat', value: 21600 },
      { label: 'Sun', value: 14400 },
    ],
    topProducts: [
      { name: 'Premium Leather Tote', qty: 143, revenue: 42500 },
      { name: 'Cashmere Scarf', qty: 38, revenue: 13200 },
      { name: 'Signature Watch', qty: 45, revenue: 31500 },
      { name: 'Silk Blouse', qty: 113, revenue: 16900 },
      { name: 'Gold Cufflinks', qty: 34, revenue: 8100 },
    ],
  },
  month: {
    totalRevenue: 512000,
    grossProfit: 187400,
    avgOrderValue: 4980,
    salesGrowthPct: -3.4,
    revenueTrend: [
      { label: 'Wk 1', value: 118000 },
      { label: 'Wk 2', value: 142000 },
      { label: 'Wk 3', value: 96000 },
      { label: 'Wk 4', value: 156000 },
    ],
    topProducts: [
      { name: 'Premium Leather Tote', qty: 512, revenue: 168400 },
      { name: 'Signature Watch', qty: 180, revenue: 126000 },
      { name: 'Cashmere Scarf', qty: 210, revenue: 73900 },
      { name: 'Silk Blouse', qty: 340, revenue: 51000 },
      { name: 'Gold Cufflinks', qty: 96, revenue: 22800 },
    ],
  },
};
