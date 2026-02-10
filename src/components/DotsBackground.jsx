import { useEffect, useRef } from "react";

export default function DotsBackground({
  dotCount = 400,
  speed = 0.4,
  dotSize = 2,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const dotsRef = useRef([]);
  const dprRef = useRef(1);
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const rand = (min, max) => Math.random() * (max - min) + min;

    // Respect reduced motion (modern UX/accessibility)
    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    // Cap DPR for performance (especially on mobile)
    dprRef.current = clamp(window.devicePixelRatio || 1, 1, 2);

    const getThemeColors = () => {
      const getVar = (name, fallback) => {
        const v = getComputedStyle(document.documentElement)
          .getPropertyValue(name)
          .trim();
        return v || fallback;
      };

      return {
        BG: getVar("--bg-canvas", "#ffffff"),
        DOT_A: getVar("--dot-a", "#111111"),
        DOT_B: getVar("--dot-b", "#9ca3af"),
        // optional connection color (falls back gracefully)
        LINK: getVar("--dot-link", "rgba(156,163,175,0.18)"),
      };
    };

    let colors = getThemeColors();

    const resize = () => {
      const dpr = dprRef.current;

      // Use viewport units (handles mobile URL bar better than innerHeight alone)
      const w = Math.max(1, Math.floor(document.documentElement.clientWidth));
      const h = Math.max(1, Math.floor(document.documentElement.clientHeight));

      sizeRef.current = { w, h };

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initDots = () => {
      const { w, h } = sizeRef.current;

      const effectiveCount = clamp(
        dotCount,
        50,
        reduceMotion ? 220 : 900 // keep it smooth on low-power devices
      );

      const baseSpeed = reduceMotion ? 0 : speed;

      dotsRef.current = Array.from({ length: effectiveCount }, () => {
        const angle = rand(0, Math.PI * 2);
        const v = rand(0.5, 1.2) * baseSpeed;

        return {
          x: rand(0, w),
          y: rand(0, h),
          vx: Math.cos(angle) * v,
          vy: Math.sin(angle) * v,
          r: rand(dotSize * 0.85, dotSize * 1.45),
          c: Math.random() < 0.75 ? colors.DOT_A : colors.DOT_B,
          a: rand(0.22, 0.65),
        };
      });
    };

    const applyTheme = () => {
      colors = getThemeColors();
      for (const p of dotsRef.current) {
        p.c = Math.random() < 0.75 ? colors.DOT_A : colors.DOT_B;
      }
    };

    // Optional: subtle “constellation” links for a more 2026 feel
    const drawLinks = () => {
      const { w, h } = sizeRef.current;
      const dots = dotsRef.current;

      // Keep linking cheap (no O(n^2)): sample a few neighbors
      const maxLinksPerDot = 2;
      const linkDist = Math.max(70, Math.min(120, Math.sqrt((w * h) / 9000)));

      ctx.save();
      ctx.strokeStyle = colors.LINK;
      ctx.lineWidth = 1;

      for (let i = 0; i < dots.length; i += 2) {
        const p = dots[i];
        let links = 0;

        // random probes instead of scanning all points
        for (let tries = 0; tries < 10 && links < maxLinksPerDot; tries++) {
          const j = (i + 1 + Math.floor(Math.random() * 18)) % dots.length;
          const q = dots[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.hypot(dx, dy);

          if (d < linkDist) {
            const alpha = (1 - d / linkDist) * 0.7;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
            links++;
          }
        }
      }

      ctx.restore();
    };

    const step = () => {
      const { w, h } = sizeRef.current;

      // background fill (fast)
      ctx.globalAlpha = 1;
      ctx.fillStyle = colors.BG;
      ctx.fillRect(0, 0, w, h);

      const dots = dotsRef.current;

      for (const p of dots) {
        p.x += p.vx;
        p.y += p.vy;

        // wrap with padding so dots don't pop at edges
        const pad = 12;
        if (p.x < -pad) p.x = w + pad;
        if (p.x > w + pad) p.x = -pad;
        if (p.y < -pad) p.y = h + pad;
        if (p.y > h + pad) p.y = -pad;

        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // subtle links on top
      if (!reduceMotion) drawLinks();

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(step);
    };

    resize();
    initDots();
    rafRef.current = requestAnimationFrame(step);

    // Watch theme change (html.dark toggles)
    const mo = new MutationObserver(() => applyTheme());
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"], // style changes can also affect CSS vars
    });

    // Resize: debounce with rAF for smoother resizing
    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        // DPR can change when moving between screens / zoom
        dprRef.current = clamp(window.devicePixelRatio || 1, 1, 2);
        resize();
        initDots();
        applyTheme();
      });
    };

    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", onResize);
      mo.disconnect();
    };
  }, [dotCount, speed, dotSize]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
