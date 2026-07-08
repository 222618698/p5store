import { useState } from 'react';
import { Link } from 'react-router-dom';

const SHOP_LINKS = ['New Arrivals', 'Best Sellers', 'Collections', 'Gift Cards'];
const COMPANY_LINKS: { label: string; to?: string }[] = [
  { label: 'About Us', to: '/about' },
  { label: 'Sustainability' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Contact', to: '/contact' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // NOTE: no newsletter/mailing-list backend exists yet — this just
    // acknowledges the submission locally.
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="border-t border-navy-100 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 sm:grid-cols-4">
        <div>
          <p className="font-display text-lg text-navy-900">Pillar 5</p>
          <p className="mt-2 text-sm text-navy-700/70">
            Redefining modern luxury commerce with curated quality and unparalleled
            service.
          </p>
        </div>

        <FooterColumn title="Shop" links={SHOP_LINKS.map((label) => ({ label }))} />
        <FooterColumn title="Company" links={COMPANY_LINKS} />

        <div>
          <p className="mb-3 text-sm font-semibold text-navy-900">Newsletter</p>
          <p className="mb-3 text-sm text-navy-700/70">
            Join our list for exclusive access.
          </p>
          {subscribed ? (
            <p className="text-sm font-medium text-status-success">Thanks for subscribing!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
              <button
                type="submit"
                className="shrink-0 rounded bg-navy-800 px-4 text-sm font-semibold text-white hover:bg-navy-700"
              >
                Join
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-navy-100 py-4 text-center text-xs text-navy-700/60">
        © 2026 Pillar 5. Above Average Excellence.
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; to?: string }[];
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-navy-900">{title}</p>
      <ul className="space-y-2 text-sm text-navy-700/70">
        {links.map(({ label, to }) => (
          <li key={label}>
            {to ? (
              <Link to={to} className="hover:text-navy-900">
                {label}
              </Link>
            ) : (
              <a href="#" className="hover:text-navy-900">
                {label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
