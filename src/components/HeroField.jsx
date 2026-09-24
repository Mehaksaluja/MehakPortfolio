import { useEffect, useRef } from 'react';

const COUNT = 86;
const LINK_DIST = 132;
const CURSOR_REACH = 200;

/** A drifting constellation that links nearby points and leans away from the cursor. */
const HeroField = () => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let w = 0;
    let h = 0;

    const cursor = { x: -9999, y: -9999, tx: -9999, ty: -9999, inside: false };
    let points = [];

    const seed = () => {
      points = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.2 + 0.5,
      }));
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const onMove = (event) => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      cursor.tx = event.clientX - rect.left;
      cursor.ty = event.clientY - rect.top;
      cursor.inside =
        cursor.tx >= 0 && cursor.tx <= rect.width && cursor.ty >= 0 && cursor.ty <= rect.height;
    };

    const draw = () => {
      const light = document.documentElement.classList.contains('light');
      const rgb = light ? '0,0,0' : '255,255,255';
      const lineMax = light ? 0.13 : 0.16;
      const dotBase = light ? 0.32 : 0.26;

      ctx.clearRect(0, 0, w, h);

      cursor.x += (cursor.tx - cursor.x) * 0.08;
      cursor.y += (cursor.ty - cursor.y) * 0.08;

      // Soft light under the cursor.
      if (cursor.inside) {
        const glow = ctx.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, 260);
        glow.addColorStop(0, `rgba(${rgb},${light ? 0.05 : 0.07})`);
        glow.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
      }

      for (const p of points) {
        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }

        // Points ease away from the cursor, then settle back.
        if (cursor.inside) {
          const dx = p.x - cursor.x;
          const dy = p.y - cursor.y;
          const dist = Math.hypot(dx, dy);
          if (dist < CURSOR_REACH && dist > 0.01) {
            const push = (1 - dist / CURSOR_REACH) * 1.4;
            p.x += (dx / dist) * push;
            p.y += (dy / dist) * push;
          }
        }
      }

      // Thread neighbours together.
      ctx.lineWidth = 1;
      for (let i = 0; i < points.length; i += 1) {
        for (let j = i + 1; j < points.length; j += 1) {
          const a = points[i];
          const b = points[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist > LINK_DIST) continue;
          ctx.strokeStyle = `rgba(${rgb},${(1 - dist / LINK_DIST) * lineMax})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const p of points) {
        const near = cursor.inside
          ? Math.max(0, 1 - Math.hypot(p.x - cursor.x, p.y - cursor.y) / CURSOR_REACH)
          : 0;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${rgb},${dotBase + near * 0.55})`;
        ctx.arc(p.x, p.y, p.r + near * 1.1, 0, Math.PI * 2);
        ctx.fill();
      }

      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="h-full w-full" />;
};

export default HeroField;
