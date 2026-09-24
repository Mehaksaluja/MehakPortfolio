import { useRef } from 'react';
import { profile } from '../data/profile';
import { useScrollEffect } from '../hooks/useScrollEffect';
import ThemeToggle from './ThemeToggle';

const links = [
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

const Masthead = () => {
  const bar = useRef(null);
  const header = useRef(null);

  useScrollEffect((y) => {
    const span = document.documentElement.scrollHeight - window.innerHeight;
    if (bar.current) {
      bar.current.style.transform = `scaleX(${span > 0 ? Math.min(1, y / span) : 0})`;
    }
    // The header only earns its border and blur once the page has moved.
    header.current?.toggleAttribute('data-stuck', y > 8);
  });

  return (
    <header
      ref={header}
      className="sticky top-0 z-50 border-b border-transparent transition-colors duration-300 data-[stuck]:border-line/60 data-[stuck]:bg-page/80 data-[stuck]:backdrop-blur-md"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5 sm:h-16 lg:px-10">
        <a href="#top" className="text-[15px] font-semibold text-ink">
          {profile.name}
        </a>

        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="hidden items-center gap-6 sm:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-[15px] text-faint transition-colors hover:text-ink"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] text-faint transition-colors hover:text-ink sm:text-[15px]"
          >
            Resume
          </a>

          <ThemeToggle />
        </div>
      </div>

      {/* Reading progress for the whole page. */}
      <span
        ref={bar}
        aria-hidden
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-ink/70"
      />
    </header>
  );
};

export default Masthead;
