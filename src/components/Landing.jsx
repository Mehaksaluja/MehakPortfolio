import { useRef } from 'react';
import { profile, social } from '../data/profile';
import { useScrollEffect } from '../hooks/useScrollEffect';
import HeroField from './HeroField';
import Portrait from './Portrait';

const icons = {
  GitHub: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.05c.53-1 1.84-2.1 3.79-2.1 4.05 0 4.8 2.67 4.8 6.14V24h-4v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.06V24h-4V8.5z" />
    </svg>
  ),
  X: (
    <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="currentColor" aria-hidden>
      <path d="M18.24 2H21.5l-7.5 8.57L23 22h-6.84l-5.36-7.01L5.4 22H2.12l8.02-9.17L1 2h7.01l4.84 6.41L18.24 2zm-1.2 18h1.7L7.05 3.9H5.22L17.04 20z" />
    </svg>
  ),
  Résumé: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M8 13h8M8 17h5" />
    </svg>
  ),
};

const Landing = () => {
  const content = useRef(null);
  const field = useRef(null);

  // Scrolling away lifts the hero out and holds the constellation back, so the two separate.
  useScrollEffect((y) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = Math.min(1, y / 560);
    if (content.current) {
      content.current.style.transform = `translate3d(0, ${t * -70}px, 0)`;
      content.current.style.opacity = `${1 - t * 0.9}`;
      content.current.style.filter = `blur(${t * 4}px)`;
    }
    if (field.current) {
      field.current.style.transform = `translate3d(0, ${t * 40}px, 0)`;
      field.current.style.opacity = `${1 - t * 0.7}`;
    }
  });

  return (
    <section id="top" className="relative overflow-hidden">
      <div
        ref={field}
        className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
      >
        <HeroField />
      </div>

      <div ref={content} className="relative mx-auto max-w-6xl px-6 pt-16 pb-10 lg:px-10 lg:pt-24">
        <div className="rise flex flex-wrap items-center gap-6">
          <Portrait />
          <div>
            <h1 className="text-5xl font-semibold tracking-tight text-ink sm:text-6xl lg:text-7xl">
              {profile.name}
            </h1>
            <p className="mt-2 text-lg text-faint">{profile.role}</p>
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted lg:text-lg">
          I build full-stack web systems and autonomous AI agents across React, Node, Flutter, and
          LangGraph. Currently a software developer intern at Zentosys Solutions.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm text-ink transition-colors hover:bg-ink/5"
          >
            {icons['Résumé']}
            Resume / CV
          </a>
          <a
            href="#work"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-page transition-opacity hover:opacity-90"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            Explore projects
          </a>
        </div>

        <div className="mt-6 flex items-center gap-4 text-faint">
          {social.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="transition-colors hover:text-ink"
            >
              {icons[link.label]}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Landing;
