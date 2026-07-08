import type { ReactNode } from 'react';
import logo from '@/assets/logo.png';

// A faint repeating column/pillar motif, echoing the brand mark, tiled
// across a warm cream backdrop (matches the reference design).
const PILLAR_SVG = `
<svg width="120" height="240" xmlns="http://www.w3.org/2000/svg">
  <g stroke="#cdbf9a" stroke-width="1.5" fill="none" opacity="0.55">
    <rect x="35" y="14" width="50" height="10" />
    <line x1="28" y1="24" x2="92" y2="24" />
    <rect x="40" y="24" width="40" height="188" />
    <line x1="50" y1="24" x2="50" y2="212" />
    <line x1="60" y1="24" x2="60" y2="212" />
    <line x1="70" y1="24" x2="70" y2="212" />
    <line x1="28" y1="212" x2="92" y2="212" />
    <rect x="35" y="212" width="50" height="10" />
  </g>
</svg>`;

const PILLAR_PATTERN_URL = `url("data:image/svg+xml,${encodeURIComponent(PILLAR_SVG)}")`;

export default function AuthShell({
  children,
  showLogo = true,
}: {
  children: ReactNode;
  showLogo?: boolean;
}) {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12"
      style={{
        backgroundColor: '#f7f2e7',
        backgroundImage: PILLAR_PATTERN_URL,
        backgroundRepeat: 'repeat',
        backgroundSize: '120px 240px',
      }}
    >
      <div className="w-full max-w-md">
        {showLogo && (
          <div className="mb-6 text-center">
            <img src={logo} alt="Pillar 5" className="mx-auto h-28 w-auto object-contain" />
          </div>
        )}
        <div className="rounded-lg bg-white p-8 shadow-xl">{children}</div>
      </div>
    </div>
  );
}
