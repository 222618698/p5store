import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDiscount,
  getDiscounts,
  setDiscountActive,
  updateDiscount,
} from '@/api/discounts';
import type { DiscountRequest, DiscountResponse, DiscountType } from '@/types';

const EMPTY_FORM = {
  code: '',
  discountType: 'PERCENTAGE' as DiscountType,
  value: '',
  usageLimit: '',
  validTo: '',
};

function formatDiscount(d: DiscountResponse): string {
  return d.discountType === 'PERCENTAGE' ? `${d.value}% Off` : `R${d.value} Off`;
}

export default function PromoCodesPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const discountsQuery = useQuery({
    queryKey: ['discounts'],
    queryFn: () => getDiscounts({ size: 50 }),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: DiscountRequest) =>
      editingId ? updateDiscount(editingId, payload) : createDiscount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      setForm(EMPTY_FORM);
      setEditingId(null);
      setFormError(null);
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Couldn't save the promo code.";
      setFormError(message);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      setDiscountActive(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.code.trim()) {
      setFormError('Code name is required.');
      return;
    }
    const value = Number(form.value);
    if (!value || value <= 0) {
      setFormError('Enter a value greater than 0.');
      return;
    }

    const payload: DiscountRequest = {
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      value,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      validTo: form.validTo ? new Date(form.validTo).toISOString() : undefined,
    };
    saveMutation.mutate(payload);
  };

  const handleEdit = (d: DiscountResponse) => {
    setEditingId(d.id);
    setForm({
      code: d.code,
      discountType: d.discountType,
      value: String(d.value),
      usageLimit: d.usageLimit != null ? String(d.usageLimit) : '',
      validTo: d.validTo ? d.validTo.slice(0, 10) : '',
    });
    setFormError(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  const discounts = discountsQuery.data?.content ?? [];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-navy-900">Promo Code Management</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="rounded-lg border border-navy-100 bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm font-semibold text-navy-900">
            {editingId ? 'Edit Promo' : 'Create New Promo'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="rounded border border-status-danger/30 bg-red-50 px-3 py-2 text-xs text-status-danger">
                {formError}
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-navy-900">
                Code Name
              </label>
              <input
                className="input"
                placeholder="e.g., SUMMER40"
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-navy-900">
                Discount Type
              </label>
              <select
                className="input"
                value={form.discountType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, discountType: e.target.value as DiscountType }))
                }
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FLAT">Fixed Amount</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-navy-900">
                {form.discountType === 'PERCENTAGE' ? 'Percentage (%)' : 'Amount (R)'}
              </label>
              <input
                type="number"
                step="0.01"
                className="input"
                placeholder="Value"
                value={form.value}
                onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-navy-900">
                Expiry Date
              </label>
              <input
                type="date"
                className="input"
                value={form.validTo}
                onChange={(e) => setForm((f) => ({ ...f, validTo: e.target.value }))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-navy-900">
                Usage Limit
              </label>
              <input
                type="number"
                className="input"
                placeholder="Usage Limit"
                value={form.usageLimit}
                onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex-1 rounded bg-navy-800 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:opacity-60"
              >
                {saveMutation.isPending
                  ? 'Saving…'
                  : editingId
                    ? 'Update Promo'
                    : 'Create Promo'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded border border-navy-100 px-4 py-2.5 text-sm font-semibold text-navy-800"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="col-span-2 rounded-lg border border-navy-100 bg-white shadow-sm">
          <p className="px-6 pt-6 text-sm font-semibold text-navy-900">
            Existing Promo Codes
          </p>
          <table className="mt-4 w-full text-left text-sm">
            <thead className="border-b border-navy-100 bg-navy-50 text-xs uppercase tracking-wide text-navy-700/70">
              <tr>
                <th className="px-6 py-3">Code</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Usage</th>
                <th className="px-4 py-3">Expiry Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discountsQuery.isLoading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-navy-700/60">
                    Loading promo codes…
                  </td>
                </tr>
              )}
              {discountsQuery.isError && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-status-danger">
                    Couldn't load promo codes.
                  </td>
                </tr>
              )}
              {!discountsQuery.isLoading && discounts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-navy-700/60">
                    No promo codes yet.
                  </td>
                </tr>
              )}
              {discounts.map((d) => (
                <tr key={d.id} className="border-b border-navy-100 last:border-0 hover:bg-navy-50/60">
                  <td className="px-6 py-3 font-medium text-navy-900">{d.code}</td>
                  <td className="px-4 py-3">
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={d.active}
                        onChange={(e) =>
                          toggleMutation.mutate({ id: d.id, active: e.target.checked })
                        }
                      />
                      <div className="h-5 w-9 rounded-full bg-navy-100 transition peer-checked:bg-status-success" />
                      <div className="absolute left-1 h-3 w-3 rounded-full bg-white transition peer-checked:translate-x-4" />
                    </label>
                  </td>
                  <td className="px-4 py-3 text-navy-700">{formatDiscount(d)}</td>
                  <td className="px-4 py-3 text-navy-700">
                    {d.usageCount}
                    {d.usageLimit != null ? ` / ${d.usageLimit}` : ''}
                  </td>
                  <td className="px-4 py-3 text-navy-700">
                    {d.validTo
                      ? new Date(d.validTo).toLocaleDateString('en-ZA', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEdit(d)}
                      className="rounded border border-navy-100 px-3 py-1 text-xs font-semibold text-navy-800 hover:bg-navy-50"
                    >
                      Edit
                    </button>
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
