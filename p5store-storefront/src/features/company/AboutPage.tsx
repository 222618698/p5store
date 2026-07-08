import Header from '@/components/Header';
import Footer from '@/components/Footer';

const WHAT_WE_DO = [
  {
    title: 'Enterprise & Business Support',
    body: 'Strategic guidance and operational excellence for growing businesses',
  },
  {
    title: 'Workforce Solutions',
    body: 'Talent development, training, and employment facilitation',
  },
  {
    title: 'Digital Marketing',
    body: 'Strategic marketing and brand development services',
  },
  {
    title: 'Tech & Digital Innovation',
    body: 'Cutting-edge technology solutions and digital transformation',
  },
  {
    title: 'Strategic Incubation',
    body: 'Mentorship and resources for innovative ventures',
  },
];

const WHY_PARTNER = [
  'Proven track record of success across multiple sectors',
  'Strategic partnerships with industry leaders',
  'Comprehensive, integrated business solutions',
  'Commitment to inclusive and sustainable growth',
  'Above average service delivery and innovation',
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-14">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
          About Pillar 5 Group
        </p>
        <h1 className="mt-2 font-display text-3xl text-navy-900">
          Above Average Solutions for Extraordinary Growth
        </h1>

        <section className="mt-10">
          <h2 className="mb-3 font-display text-xl text-navy-900">Our Mission</h2>
          <p className="text-sm leading-relaxed text-navy-700/80">
            Pillar 5 Group is dedicated to empowering businesses and individuals to reach
            their full potential. We are committed to fostering economic growth, promoting
            inclusive development, and driving innovation across South Africa and beyond.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-navy-700/80">
            Our tagline "Above Average" reflects our commitment to delivering exceptional
            services that exceed expectations and transform lives.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 font-display text-xl text-navy-900">What We Do</h2>
          <p className="mb-4 text-sm leading-relaxed text-navy-700/80">
            We provide comprehensive business support services across five core pillars:
          </p>
          <ul className="space-y-3">
            {WHAT_WE_DO.map((item) => (
              <li key={item.title} className="flex gap-2 text-sm leading-relaxed text-navy-700/80">
                <span className="text-gold-600">•</span>
                <span>
                  <span className="font-semibold text-navy-900">{item.title}:</span>{' '}
                  {item.body}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 font-display text-xl text-navy-900">Our Impact</h2>
          <p className="text-sm leading-relaxed text-navy-700/80">
            We partner with industry leaders including Microsoft, FNB, Afrika Tikkun, CPUT,
            and YALDA to create meaningful impact. Our work spans SMEs, corporate
            organizations, and informal businesses, helping transform economies and create
            inclusive growth opportunities.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-navy-700/80">
            Through our innovative approaches and strategic partnerships, we have
            demonstrated tangible results in workforce development, business performance,
            and community empowerment.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 font-display text-xl text-navy-900">Why Partner with Us?</h2>
          <ul className="space-y-2">
            {WHY_PARTNER.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-navy-700/80">
                <span className="mt-0.5 text-status-success">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
