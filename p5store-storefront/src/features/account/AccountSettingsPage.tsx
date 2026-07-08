import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { getUser, updateProfile, changePassword, uploadAvatar } from '@/api/users';
import { getAddresses, createAddress, deleteAddress } from '@/api/addresses';
import type { AddressRequest, UpdateProfileRequest } from '@/types';

const PROVINCES = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo',
  'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape',
];

export default function AccountSettingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ['user', user?.userId],
    queryFn: () => getUser(user!.userId),
    enabled: !!user,
  });

  const [profile, setProfile] = useState<UpdateProfileRequest>({
    firstName: '', lastName: '', email: '', phone: '',
    newsletterOptIn: true, offersOptIn: true, smsOptIn: false,
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (!userQuery.data) return;
    setProfile({
      firstName: userQuery.data.firstName,
      lastName: userQuery.data.lastName,
      email: userQuery.data.email,
      phone: userQuery.data.phone ?? '',
      avatarUrl: userQuery.data.avatarUrl ?? undefined,
      newsletterOptIn: userQuery.data.newsletterOptIn,
      offersOptIn: userQuery.data.offersOptIn,
      smsOptIn: userQuery.data.smsOptIn,
    });
    setAvatarUrl(userQuery.data.avatarUrl ?? null);
  }, [userQuery.data]);

  const avatarMutation = useMutation({
    mutationFn: (file: File) => uploadAvatar(user!.userId, file),
    onSuccess: (data) => {
      setAvatarUrl(data.url);
      setProfile((p) => ({ ...p, avatarUrl: data.url }));
    },
  });

  const profileMutation = useMutation({
    mutationFn: () => updateProfile(user!.userId, { ...profile, avatarUrl: avatarUrl ?? undefined }),
    onSuccess: (data) => {
      queryClient.setQueryData(['user', user?.userId], data);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    },
  });

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordSaved, setPasswordSaved] = useState(false);

  const passwordMutation = useMutation({
    mutationFn: () => changePassword(user!.userId, {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    }),
    onSuccess: () => {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 2000);
    },
  });

  const passwordsMatch = passwordForm.newPassword.length >= 6 && passwordForm.newPassword === passwordForm.confirmPassword;

  const addressesQuery = useQuery({
    queryKey: ['addresses', user?.userId],
    queryFn: () => getAddresses(user!.userId),
    enabled: !!user,
  });

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressRequest>({
    street: '', city: '', province: '', postalCode: '', country: 'South Africa',
  });

  const createAddressMutation = useMutation({
    mutationFn: () => createAddress(user!.userId, addressForm),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.userId] });
      setAddressForm({ street: '', city: '', province: '', postalCode: '', country: 'South Africa' });
      setShowAddressForm(false);
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (addressId: number) => deleteAddress(user!.userId, addressId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses', user?.userId] }),
  });

  const addresses = addressesQuery.data ?? [];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl text-navy-900">Settings</h1>

      {/* Personal Information */}
      <section className="rounded-lg border border-navy-100 p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-navy-700/70">
          Personal Information
        </h2>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-navy-100 text-lg font-semibold text-navy-700">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              (profile.firstName?.[0] ?? '') + (profile.lastName?.[0] ?? '')
            )}
          </div>
          <label className="cursor-pointer rounded border border-navy-100 px-3 py-1.5 text-xs font-semibold text-navy-800 hover:bg-navy-50">
            {avatarMutation.isPending ? 'Uploading…' : 'Change Photo'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) avatarMutation.mutate(file);
              }}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-navy-700/70">First Name</label>
            <input
              className="input"
              value={profile.firstName}
              onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-navy-700/70">Last Name</label>
            <input
              className="input"
              value={profile.lastName}
              onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-navy-700/70">Email</label>
            <input
              className="input"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-navy-700/70">Phone</label>
            <input
              className="input"
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>
        </div>

        {profileMutation.isError && (
          <p className="mt-3 text-xs text-status-danger">
            Couldn't save changes. Check your details and try again.
          </p>
        )}

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => profileMutation.mutate()}
            disabled={profileMutation.isPending || !profile.firstName || !profile.lastName || !profile.email}
            className="rounded bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
          >
            {profileMutation.isPending ? 'Saving…' : 'Save Changes'}
          </button>
          {profileSaved && <span className="text-xs font-medium text-status-success">Saved!</span>}
        </div>
      </section>

      {/* Communications */}
      <section className="rounded-lg border border-navy-100 p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-navy-700/70">
          Communications
        </h2>
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input
              type="checkbox"
              checked={profile.newsletterOptIn ?? false}
              onChange={(e) => setProfile((p) => ({ ...p, newsletterOptIn: e.target.checked }))}
            />
            Weekly Newsletter
          </label>
          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input
              type="checkbox"
              checked={profile.offersOptIn ?? false}
              onChange={(e) => setProfile((p) => ({ ...p, offersOptIn: e.target.checked }))}
            />
            Exclusive Offers
          </label>
          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input
              type="checkbox"
              checked={profile.smsOptIn ?? false}
              onChange={(e) => setProfile((p) => ({ ...p, smsOptIn: e.target.checked }))}
            />
            SMS Notifications
          </label>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => profileMutation.mutate()}
            disabled={profileMutation.isPending}
            className="rounded bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
          >
            {profileMutation.isPending ? 'Saving…' : 'Save Preferences'}
          </button>
          {profileSaved && <span className="text-xs font-medium text-status-success">Saved!</span>}
        </div>
      </section>

      {/* Security */}
      <section className="rounded-lg border border-navy-100 p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-navy-700/70">
          Security
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-navy-700/70">Current Password</label>
            <input
              className="input"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-navy-700/70">New Password</label>
            <input
              className="input"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-navy-700/70">Confirm New Password</label>
            <input
              className="input"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            />
          </div>
        </div>

        {passwordMutation.isError && (
          <p className="mt-3 text-xs text-status-danger">
            Couldn't change password. Check your current password and try again.
          </p>
        )}
        {passwordForm.confirmPassword && !passwordsMatch && (
          <p className="mt-3 text-xs text-status-danger">
            New password must be at least 6 characters and match confirmation.
          </p>
        )}

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => passwordMutation.mutate()}
            disabled={passwordMutation.isPending || !passwordForm.currentPassword || !passwordsMatch}
            className="rounded bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
          >
            {passwordMutation.isPending ? 'Updating…' : 'Update Password'}
          </button>
          {passwordSaved && <span className="text-xs font-medium text-status-success">Password updated!</span>}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-navy-100 pt-6 opacity-60">
          <div>
            <p className="text-sm font-medium text-navy-900">Two-Factor Authentication</p>
            <p className="text-xs text-navy-700/60">Coming soon</p>
          </div>
          <button disabled className="relative h-6 w-11 rounded-full bg-navy-100">
            <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between opacity-60">
          <div>
            <p className="text-sm font-medium text-navy-900">Active Sessions</p>
            <p className="text-xs text-navy-700/60">Coming soon</p>
          </div>
          <button disabled className="rounded border border-navy-100 px-3 py-1.5 text-xs font-semibold text-navy-800">
            Log out all
          </button>
        </div>
      </section>

      {/* Saved Addresses */}
      <section className="rounded-lg border border-navy-100 p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-navy-700/70">
          Saved Addresses
        </h2>

        {addressesQuery.isLoading && <p className="text-sm text-navy-700/60">Loading…</p>}

        <div className="grid grid-cols-2 gap-4">
          {addresses.map((a) => (
            <div key={a.id} className="rounded-lg border border-navy-100 p-4 text-sm">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-gold-600">
                  {a.type === 'BILLING' ? 'Office' : 'Home'}
                </span>
                {a.isDefault && (
                  <span className="rounded bg-navy-100 px-1.5 py-0.5 text-[10px] font-semibold text-navy-700">
                    Default
                  </span>
                )}
              </div>
              <p className="font-medium text-navy-900">{a.street}</p>
              <p className="text-navy-700/70">
                {a.city}{a.province ? `, ${a.province}` : ''} {a.postalCode}, {a.country}
              </p>
              <button
                onClick={() => deleteAddressMutation.mutate(a.id)}
                className="mt-2 text-xs font-semibold text-status-danger hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          {!showAddressForm && (
            <button
              onClick={() => setShowAddressForm(true)}
              className="flex min-h-[110px] items-center justify-center rounded-lg border border-dashed border-navy-200 text-sm font-semibold text-navy-700/70 hover:bg-navy-50"
            >
              + Add New Address
            </button>
          )}
        </div>

        {showAddressForm && (
          <div className="mt-4 rounded-lg border border-navy-100 p-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                className="input col-span-2"
                placeholder="Street Address"
                value={addressForm.street}
                onChange={(e) => setAddressForm((f) => ({ ...f, street: e.target.value }))}
              />
              <input
                className="input"
                placeholder="City"
                value={addressForm.city}
                onChange={(e) => setAddressForm((f) => ({ ...f, city: e.target.value }))}
              />
              <select
                className="input"
                value={addressForm.province}
                onChange={(e) => setAddressForm((f) => ({ ...f, province: e.target.value }))}
              >
                <option value="">Select province…</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <input
                className="input"
                placeholder="Postal Code"
                value={addressForm.postalCode}
                onChange={(e) => setAddressForm((f) => ({ ...f, postalCode: e.target.value }))}
              />
              <input
                className="input"
                placeholder="Country"
                value={addressForm.country}
                onChange={(e) => setAddressForm((f) => ({ ...f, country: e.target.value }))}
              />
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setShowAddressForm(false)}
                className="rounded border border-navy-100 px-3 py-1.5 text-xs font-semibold text-navy-800"
              >
                Cancel
              </button>
              <button
                onClick={() => createAddressMutation.mutate()}
                disabled={
                  createAddressMutation.isPending ||
                  !addressForm.street ||
                  !addressForm.city ||
                  !addressForm.postalCode ||
                  !addressForm.country
                }
                className="rounded bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
              >
                {createAddressMutation.isPending ? 'Saving…' : 'Save Address'}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
