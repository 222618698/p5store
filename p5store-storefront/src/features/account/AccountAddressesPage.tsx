import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { getAddresses, createAddress, deleteAddress } from '@/api/addresses';
import type { AddressRequest } from '@/types';

const PROVINCES = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo',
  'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape',
];

export default function AccountAddressesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddressRequest>({
    street: '', city: '', province: '', postalCode: '', country: 'South Africa',
  });

  const addressesQuery = useQuery({
    queryKey: ['addresses', user?.userId],
    queryFn: () => getAddresses(user!.userId),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: () => createAddress(user!.userId, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.userId] });
      setForm({ street: '', city: '', province: '', postalCode: '', country: 'South Africa' });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (addressId: number) => deleteAddress(user!.userId, addressId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses', user?.userId] }),
  });

  const addresses = addressesQuery.data ?? [];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-navy-900">Addresses</h1>

      {addressesQuery.isLoading && <p className="text-sm text-navy-700/60">Loading…</p>}

      {!addressesQuery.isLoading && addresses.length === 0 && !showForm && (
        <p className="mb-4 text-sm text-navy-700/60">You haven't saved any addresses yet.</p>
      )}

      <div className="space-y-3">
        {addresses.map((a) => (
          <div key={a.id} className="flex items-start justify-between rounded-lg border border-navy-100 p-4 text-sm">
            <div>
              <p className="font-medium text-navy-900">{a.street}</p>
              <p className="text-navy-700/70">
                {a.city}{a.province ? `, ${a.province}` : ''} {a.postalCode}, {a.country}
              </p>
              {a.isDefault && (
                <span className="mt-1 inline-block rounded bg-navy-100 px-1.5 py-0.5 text-[10px] font-semibold text-navy-700">
                  Default
                </span>
              )}
            </div>
            <button
              onClick={() => deleteMutation.mutate(a.id)}
              className="text-xs font-semibold text-status-danger hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 rounded bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
        >
          + Add Address
        </button>
      ) : (
        <div className="mt-4 rounded-lg border border-navy-100 p-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              className="input col-span-2"
              placeholder="Street Address"
              value={form.street}
              onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
            />
            <input
              className="input"
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            />
            <select
              className="input"
              value={form.province}
              onChange={(e) => setForm((f) => ({ ...f, province: e.target.value }))}
            >
              <option value="">Select province…</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input
              className="input"
              placeholder="Postal Code"
              value={form.postalCode}
              onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
            />
            <input
              className="input"
              placeholder="Country"
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="rounded border border-navy-100 px-3 py-1.5 text-xs font-semibold text-navy-800"
            >
              Cancel
            </button>
            <button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !form.street || !form.city || !form.postalCode || !form.country}
              className="rounded bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
            >
              {createMutation.isPending ? 'Saving…' : 'Save Address'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
