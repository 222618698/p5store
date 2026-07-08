import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getContactMessages } from '@/api/contactMessages';
import type { ContactMessageResponse } from '@/types';

const PAGE_SIZE = 20;

export default function ContactMessagesPage() {
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<ContactMessageResponse | null>(null);

  const messagesQuery = useQuery({
    queryKey: ['contact-messages', page],
    queryFn: () => getContactMessages({ page, size: PAGE_SIZE }),
  });

  const messages = messagesQuery.data?.content ?? [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-xl text-navy-900">Contact Messages</h1>
        <p className="text-sm text-navy-700/60">
          Inquiries submitted through the storefront's "Get in Touch" form.
        </p>
      </div>

      {selected ? (
        <MessageDetail message={selected} onBack={() => setSelected(null)} />
      ) : (
        <>
          {messagesQuery.isLoading && (
            <p className="text-sm text-navy-700/60">Loading messages…</p>
          )}

          {!messagesQuery.isLoading && messages.length === 0 && (
            <div className="mx-auto max-w-md rounded-lg border border-navy-100 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-50">
                <MailIcon className="h-7 w-7 text-navy-700/50" />
              </div>
              <h2 className="mb-2 font-display text-xl text-navy-900">No Messages Yet</h2>
              <p className="text-sm text-navy-700/60">
                When visitors submit the "Get in Touch" form on the storefront, their
                messages will appear here.
              </p>
            </div>
          )}

          {messages.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-navy-100 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-navy-100 bg-navy-50 text-xs uppercase tracking-wide text-navy-700/70">
                  <tr>
                    <th className="px-4 py-3">From</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m) => (
                    <tr key={m.id} className="border-b border-navy-100 last:border-0 hover:bg-navy-50/60">
                      <td className="px-4 py-3">
                        <p className="font-medium text-navy-900">{m.fullName}</p>
                        <p className="text-xs text-navy-700/60">{m.email}</p>
                      </td>
                      <td className="px-4 py-3 text-navy-700">{m.company || '—'}</td>
                      <td className="max-w-xs truncate px-4 py-3 text-navy-700">{m.message}</td>
                      <td className="px-4 py-3 text-navy-700">
                        {new Date(m.createdAt).toLocaleDateString('en-ZA', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelected(m)}
                          className="text-xs font-semibold text-navy-800 hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {messagesQuery.data && messagesQuery.data.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-navy-700">
              <span>
                Page {messagesQuery.data.number + 1} of {messagesQuery.data.totalPages} ·{' '}
                {messagesQuery.data.totalElements} messages
              </span>
              <div className="flex gap-2">
                <button
                  disabled={messagesQuery.data.first}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="rounded border border-navy-100 px-3 py-1.5 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={messagesQuery.data.last}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded border border-navy-100 px-3 py-1.5 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function MessageDetail({
  message,
  onBack,
}: {
  message: ContactMessageResponse;
  onBack: () => void;
}) {
  return (
    <div className="rounded-lg border border-navy-100 bg-white p-6 shadow-sm">
      <button onClick={onBack} className="mb-4 text-xs font-semibold text-navy-700 hover:underline">
        ← Back to all messages
      </button>

      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="font-display text-lg text-navy-900">{message.fullName}</p>
          <p className="text-xs text-navy-700/60">
            Sent {new Date(message.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <dl className="mb-6 grid grid-cols-2 gap-4 border-b border-navy-100 pb-6 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs text-navy-700/50">Email</dt>
          <dd className="text-navy-900">
            <a href={`mailto:${message.email}`} className="hover:underline">
              {message.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-navy-700/50">Phone</dt>
          <dd className="text-navy-900">{message.phone || '—'}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs text-navy-700/50">Company/Organization</dt>
          <dd className="text-navy-900">{message.company || '—'}</dd>
        </div>
      </dl>

      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-navy-700/60">
        Message
      </p>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-navy-900">
        {message.message}
      </p>
    </div>
  );
}

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6 9 7 9-7" />
    </svg>
  );
}
