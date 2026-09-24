import { useEffect, useRef } from 'react';

/**
 * Calls `handler` with the current scroll offset, coalesced to one call per frame.
 * Handlers write straight to the DOM, so nothing here triggers a React render.
 */
export const useScrollEffect = (handler) => {
  const latest = useRef(handler);
  latest.current = handler;

  useEffect(() => {
    let frame = 0;

    const run = () => {
      frame = 0;
      latest.current(window.scrollY);
    };

    const queue = () => {
      if (!frame) frame = requestAnimationFrame(run);
    };

    run();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
    };
  }, []);
};
