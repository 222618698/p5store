import { useMemo, useState } from 'react';
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { mockCustomers, type MockCustomer } from './mockCustomers';

const PAGE_SIZE = 5;

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function toCsv(rows: MockCustomer[]): string {
  const header = ['Name', 'Email', 'Location', 'Join Date', 'Total Spend', 'Status'];
  const lines = rows.map((c) =>
    [c.name, c.email, c.location, c.joinDate, c.totalSpend.toFixed(2), c.status]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  );
  return [header.join(','), ...lines].join('\n');
}

function downloadCsv(rows: MockCustomer[]) {
  const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'customers.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [page, setPage] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', location: '' });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers.filter((c) => {
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const stats = useMemo(() => {
    const activeCount = customers.filter((c) => c.status === 'ACTIVE').length;
    const newThisWeek = customers.filter(
      (c) => Date.now() - new Date(c.joinDate).getTime() < 7 * 24 * 60 * 60 * 1000
    ).length;
    return { total: customers.length, active: activeCount, newThisWeek };
  }, [customers]);

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) return;
    setCustomers((prev) => [
      {
        id: Math.max(0, ...prev.map((c) => c.id)) + 1,
        name: newCustomer.name,
        email: newCustomer.email,
        location: newCustomer.location || '—',
        joinDate: new Date().toISOString().slice(0, 10),
        totalSpend: 0,
        status: 'ACTIVE',
      },
      ...prev,
    ]);
    setNewCustomer({ name: '', email: '', location: '' });
    setShowAddForm(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl text-navy-900">Customer Management</h1>
          <p className="mt-1 text-sm text-navy-700/70">
            Manage profiles, track spending, and engage with your client base.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="rounded bg-navy-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-700"
          >
            + Add Customer
          </button>
          <button
            onClick={() => downloadCsv(filtered)}
            className="rounded bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-gold-600"
          >
            Export to CSV
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6 rounded-lg border border-navy-100 bg-white p-4 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-navy-900">New customer</p>
          <div className="grid grid-cols-3 gap-3">
            <input
              className="input"
              placeholder="Full name"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer((c) => ({ ...c, name: e.target.value }))}
            />
            <input
              className="input"
              placeholder="Email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer((c) => ({ ...c, email: e.target.value }))}
            />
            <input
              className="input"
              placeholder="Location"
              value={newCustomer.location}
              onChange={(e) => setNewCustomer((c) => ({ ...c, location: e.target.value }))}
            />
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="rounded border border-navy-100 px-3 py-1.5 text-sm font-semibold text-navy-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCustomer}
              className="rounded bg-navy-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-navy-700"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Total Registered" value={String(stats.total)} />
        <StatCard label="Active Customers" value={String(stats.active)} accent="gold" />
        <StatCard label="New This Week" value={String(stats.newThisWeek)} />
      </div>

      <div className="mb-4 flex items-center gap-3">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          placeholder="Search by name or email…"
          className="w-72 rounded border border-navy-100 bg-white px-3 py-2 text-sm outline-none focus:border-navy-600 focus:ring-1 focus:ring-navy-600"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as typeof statusFilter);
            setPage(0);
          }}
          className="rounded border border-navy-100 bg-white px-3 py-2 text-sm outline-none focus:border-navy-600 focus:ring-1 focus:ring-navy-600"
        >
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-navy-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-navy-100 bg-navy-50 text-xs uppercase tracking-wide text-navy-700/70">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Join Date</th>
              <th className="px-4 py-3">Total Spend</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-navy-700/60">
                  No customers found.
                </td>
              </tr>
            )}
            {pageRows.map((c) => (
              <tr key={c.id} className="border-b border-navy-100 last:border-0 hover:bg-navy-50/60">
                <td className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-100 text-xs font-semibold text-navy-800">
                    {initials(c.name)}
                  </div>
                  <div>
                    <p className="font-medium text-navy-900">{c.name}</p>
                    <p className="text-xs text-navy-700/60">{c.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-navy-700">{c.location}</td>
                <td className="px-4 py-3 text-navy-700">
                  {new Date(c.joinDate).toLocaleDateString('en-ZA', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3 text-navy-900">
                  R{c.totalSpend.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-navy-700">
        <span>
          Showing {pageRows.length === 0 ? 0 : page * PAGE_SIZE + 1} to{' '}
          {Math.min(filtered.length, page * PAGE_SIZE + PAGE_SIZE)} of {filtered.length} entries
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded border border-navy-100 px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="rounded border border-navy-100 px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
