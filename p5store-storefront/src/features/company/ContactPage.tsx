import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { submitContactMessage } from '@/api/contact';
import type { ContactMessageRequest } from '@/types';

const FEATURES = [
  {
    icon: BoltIcon,
    title: 'Quick Implementation',
    body: 'Get your projects live in weeks, not months',
  },
  {
    icon: TargetIcon,
    title: 'Proven Track Record',
    body: 'Delivering tangible results for SMMEs and corporates',
  },
  {
    icon: UsersIcon,
    title: 'Expert Team',
    body: 'Dedicated professionals with deep market insight',
  },
];

const CONTACT_CARDS = [
  { icon: MailIcon, label: 'Email', lines: ['info@pillar5group.co.za'] },
  { icon: PhoneIcon, label: 'Call', lines: ['+27 64 538 6885'] },
  { icon: GlobeIcon, label: 'Website', lines: ['www.pillar5group.com', 'www.pillar5group.co.za'] },
  {
    icon: PinIcon,
    label: 'Address',
    lines: ['Business Innovation & Incubation Centre, CPUT, District Six Campus, Cape Town'],
  },
];

const EMPTY_FORM: ContactMessageRequest = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  message: '',
};

export default function ContactPage() {
  const [form, setForm] = useState<ContactMessageRequest>(EMPTY_FORM);

  const submitMutation = useMutation({
    mutationFn: () => submitContactMessage(form),
    onSuccess: () => setForm(EMPTY_FORM),
  });

  const canSubmit = form.fullName.trim() && form.email.trim() && form.message.trim();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="relative overflow-hidden bg-navy-950 px-6 py-20 text-center text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(197,155,79,0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(197,155,79,0.15), transparent 40%)',
          }}
        />

        <div className="relative">
          <span className="mb-5 inline-block rounded bg-gold-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-navy-950">
            Partner With Us
          </span>
          <h1 className="mx-auto max-w-3xl font-display text-4xl leading-tight sm:text-5xl">
            Let's Build the <span className="text-gold-400">Future Together</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-navy-100/80 sm:text-base">
            Partner with Pillar 5 Group to co-create impactful projects that drive innovation,
            empower communities, and generate sustainable economic growth.
          </p>

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-lg border border-navy-800 bg-navy-900/60 p-6 text-center backdrop-blur-sm transition hover:border-gold-500/40"
              >
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-xs text-navy-100/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-14">
        <div className="overflow-hidden rounded-xl border border-navy-100 bg-white shadow-lg shadow-navy-900/5">
          <div className="h-1.5 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600" />

          <div className="p-8 sm:p-10">
          <h2 className="text-center font-display text-2xl font-bold text-navy-900">
            Get in Touch
          </h2>

          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (canSubmit) submitMutation.mutate();
            }}
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-navy-900">
                  Full Name <span className="text-status-danger">*</span>
                </label>
                <input
                  className="input"
                  placeholder="John Doe"
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-navy-900">
                  Email Address <span className="text-status-danger">*</span>
                </label>
                <input
                  type="email"
                  className="input"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-navy-900">
                  Phone Number
                </label>
                <input
                  className="input"
                  placeholder="+27 64 538 6885"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-navy-900">
                  Company/Organization
                </label>
                <input
                  className="input"
                  placeholder="Your Company"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-navy-900">
                Message <span className="text-status-danger">*</span>
              </label>
              <textarea
                className="input min-h-[110px] resize-y"
                placeholder="Tell us about your project or inquiry..."
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                required
              />
            </div>

            {submitMutation.isError && (
              <p className="text-sm text-status-danger">
                Couldn't send your message. Please try again.
              </p>
            )}
            {submitMutation.isSuccess && (
              <p className="text-sm font-medium text-status-success">
                Thanks — your message has been sent. We'll be in touch soon.
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit || submitMutation.isPending}
              className="flex items-center gap-2 rounded bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-gold-600 disabled:opacity-60"
            >
              <MailIcon className="h-4 w-4" />
              {submitMutation.isPending ? 'Sending…' : 'Send Message'}
            </button>
          </form>

          <div className="mt-10 border-t border-navy-100 pt-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-navy-700/60">
              Or reach us directly
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
              {CONTACT_CARDS.map(({ icon: Icon, label, lines }) => (
                <div
                  key={label}
                  className="group rounded-lg border border-navy-100 p-4 transition hover:border-gold-400/60 hover:shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded bg-navy-950 text-gold-400 transition group-hover:bg-gold-500 group-hover:text-navy-950">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-navy-900">{label}</p>
                  {lines.map((line) => (
                    <p key={line} className="text-xs text-navy-700/60">
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function BoltIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
    </svg>
  );
}

function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
      <path d="M16 8.5c1.5.2 2.7 1.5 2.7 3s-1.2 2.8-2.7 3" />
      <path d="M21.5 20c0-2.8-1.9-5.1-4.5-5.9" />
    </svg>
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

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2C9.4 21 3 14.6 3 6a2 2 0 0 1 1-2Z" />
    </svg>
  );
}

function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 3.8 6 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-6-3.8-9S9.5 5.7 12 3Z" />
    </svg>
  );
}

function PinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
