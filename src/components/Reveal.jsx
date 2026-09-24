import { useEffect, useRef, useState } from 'react';

/* Each variant is a [hidden, shown] pair of utility strings. */
const variants = {
  up: [
    '[transform:perspective(1200px)_translateY(52px)_scale(0.95)] opacity-0 blur-[10px]',
    '[transform:none] opacity-100 blur-0',
  ],
  tilt: [
    '[transform:perspective(1000px)_rotateX(16deg)_translateY(64px)] opacity-0 blur-[12px]',
    '[transform:none] opacity-100 blur-0',
  ],
  wipe: [
    '[clip-path:inset(0_0_100%_0)] [transform:translateY(28px)] opacity-0',
    '[clip-path:inset(0)] [transform:none] opacity-100',
  ],
  slide: [
    '[transform:translateX(-36px)] opacity-0 blur-[6px]',
    '[transform:none] opacity-100 blur-0',
  ],
};

/** Animates a block the first time it scrolls into view. */
const Reveal = ({ children, delay = 0, variant = 'up', className = '', as: Tag = 'div' }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const [hidden, visible] = variants[variant] ?? variants.up;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-shown={shown ? '' : undefined}
      className={`${className} transition-[opacity,transform,filter,clip-path] duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        shown ? visible : hidden
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
