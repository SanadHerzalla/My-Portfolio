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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    dprRef.current = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const rand = (min, max) => Math.random() * (max - min) + min;

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
      };
    };

    let colors = getThemeColors();

    const resize = () => {
      const dpr = dprRef.current;
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initDots = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      dotsRef.current = Array.from({ length: dotCount }, () => {
        const angle = rand(0, Math.PI * 2);
        const v = rand(0.5, 1.2) * speed;

        return {
          x: rand(0, w),
          y: rand(0, h),
          vx: Math.cos(angle) * v,
          vy: Math.sin(angle) * v,
          r: rand(dotSize * 0.8, dotSize * 1.5),
          c: Math.random() < 0.75 ? colors.DOT_A : colors.DOT_B,
          a: rand(0.25, 0.7),
        };
      });
    };

    const applyTheme = () => {
      colors = getThemeColors();
      // recolor existing dots (no jump)
      for (const p of dotsRef.current) {
        p.c = Math.random() < 0.75 ? colors.DOT_A : colors.DOT_B;
      }
    };

    const step = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.fillStyle = colors.BG;
      ctx.fillRect(0, 0, w, h);

      for (const p of dotsRef.current) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(step);
    };

    resize();
    initDots();
    rafRef.current = requestAnimationFrame(step);

    // ✅ watch theme change (html.dark toggles)
    const mo = new MutationObserver(() => {
      applyTheme();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const onResize = () => {
      resize();
      initDots();
      applyTheme();
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
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
