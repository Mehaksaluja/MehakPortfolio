import { useEffect, useRef, useState } from 'react';

const KEY = 'portfolio:theme';

const ThemeToggle = () => {
  const button = useRef(null);
  const mounted = useRef(false);
  const [light, setLight] = useState(() => localStorage.getItem(KEY) === 'light');

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      root.classList.toggle('light', light);
      localStorage.setItem(KEY, light ? 'light' : 'dark');
    };

    const plain =
      !mounted.current ||
      typeof document.startViewTransition !== 'function' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    mounted.current = true;

    if (plain) {
      apply();
      return;
    }

    // The new theme grows out of the button as a circle wide enough to clear the viewport.
    const box = button.current?.getBoundingClientRect();
    const x = box ? box.left + box.width / 2 : window.innerWidth - 40;
    const y = box ? box.top + box.height / 2 : 40;
    const reach = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    root.style.setProperty('--wipe-x', `${x}px`);
    root.style.setProperty('--wipe-y', `${y}px`);
    root.style.setProperty('--wipe-r', `${reach}px`);
    root.dataset.wipe = '';

    document
      .startViewTransition(apply)
      .finished.finally(() => delete root.dataset.wipe);
  }, [light]);

  return (
    <button
      ref={button}
      type="button"
      onClick={() => setLight((on) => !on)}
      aria-label={light ? 'Switch to dark theme' : 'Switch to light theme'}
      className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-line text-faint transition-colors hover:border-ink/25 hover:text-ink active:scale-90"
    >
      <svg
        viewBox="0 0 24 24"
        className={`absolute h-[15px] w-[15px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          light ? 'translate-y-4 rotate-90 opacity-0' : 'translate-y-0 rotate-0 opacity-100'
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>

      <svg
        viewBox="0 0 24 24"
        className={`absolute h-[17px] w-[17px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          light ? 'translate-y-0 rotate-0 opacity-100' : '-translate-y-4 -rotate-90 opacity-0'
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
      </svg>
    </button>
  );
};

export default ThemeToggle;
