import { useEffect, useRef } from "react";

export default function DotsBackground({
  dotCount = 750,
  speed = 0.35,
  dotSize = 2.6,
  link = true,
  interactive = true,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  const stateRef = useRef({
    dpr: 1,
    w: 0,
    h: 0,
    dots: [],
    grid: new Map(),
    mouse: { x: 0, y: 0, active: false },
    colors: {
      BG: "#0b1020",
      DOT_A: "#e5e7eb",
      DOT_B: "#9ca3af",
      LINK: "rgba(156,163,175,0.18)",
      WASH_A: "rgba(56,189,248,0.10)", // cyan-ish
      WASH_B: "rgba(168,85,247,0.08)", // violet-ish
    },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const rand = (min, max) => Math.random() * (max - min) + min;

    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    const getVar = (name, fallback) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    };

    const readTheme = () => {
      // Works with your existing CSS vars, but adds optional "wash" vars too.
      stateRef.current.colors = {
        BG: getVar("--bg-canvas", "#0b1020"),
        DOT_A: getVar("--dot-a", "#e5e7eb"),
        DOT_B: getVar("--dot-b", "#9ca3af"),
        LINK: getVar("--dot-link", "rgba(156,163,175,0.18)"),
        WASH_A: getVar("--bg-wash-a", "rgba(56,189,248,0.10)"),
        WASH_B: getVar("--bg-wash-b", "rgba(168,85,247,0.08)"),
      };
    };

    const resize = () => {
      const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      const w = Math.max(1, Math.floor(document.documentElement.clientWidth));
      const h = Math.max(1, Math.floor(document.documentElement.clientHeight));

      const st = stateRef.current;
      st.dpr = dpr;
      st.w = w;
      st.h = h;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initDots = () => {
      const st = stateRef.current;
      const { w, h } = st;

      // cap for perf, but keep density nice on large screens
      const max = reduceMotion ? 280 : 950;
      const count = clamp(dotCount, 80, max);

      // Depth layers = modern “2025” feel
      // z affects size, speed, alpha
      const baseSpeed = reduceMotion ? 0 : speed;

      st.dots = Array.from({ length: count }, () => {
        const z = rand(0.25, 1); // depth
        const angle = rand(0, Math.PI * 2);
        const v = rand(0.4, 1.15) * baseSpeed * (0.35 + z);

        return {
          x: rand(0, w),
          y: rand(0, h),
          vx: Math.cos(angle) * v,
          vy: Math.sin(angle) * v,
          z,
          r: rand(dotSize * 0.75, dotSize * 1.45) * (0.65 + z * 0.6),
          a: rand(0.12, 0.55) * (0.35 + z),
          c: Math.random() < 0.72 ? st.colors.DOT_A : st.colors.DOT_B,
        };
      });
    };

    const rebuildGrid = (cellSize) => {
      const st = stateRef.current;
      st.grid.clear();

      for (let i = 0; i < st.dots.length; i++) {
        const p = st.dots[i];
        const cx = Math.floor(p.x / cellSize);
        const cy = Math.floor(p.y / cellSize);
        const key = `${cx},${cy}`;
        const arr = st.grid.get(key);
        if (arr) arr.push(i);
        else st.grid.set(key, [i]);
      }
    };

    const applyThemeToDots = () => {
      const st = stateRef.current;
      for (const p of st.dots) {
        p.c = Math.random() < 0.72 ? st.colors.DOT_A : st.colors.DOT_B;
      }
    };

    const onPointerMove = (e) => {
      if (!interactive) return;
      const st = stateRef.current;
      st.mouse.x = e.clientX;
      st.mouse.y = e.clientY;
      st.mouse.active = true;
    };

    const onPointerLeave = () => {
      if (!interactive) return;
      stateRef.current.mouse.active = false;
    };

    const drawWash = () => {
      // subtle gradient wash + vignette (very “2025”)
      const st = stateRef.current;
      const { w, h } = st;

      // base bg
      ctx.globalAlpha = 1;
      ctx.fillStyle = st.colors.BG;
      ctx.fillRect(0, 0, w, h);

      // wash
      const g1 = ctx.createRadialGradient(w * 0.22, h * 0.18, 0, w * 0.22, h * 0.18, Math.max(w, h) * 0.7);
      g1.addColorStop(0, st.colors.WASH_A);
      g1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(w * 0.82, h * 0.55, 0, w * 0.82, h * 0.55, Math.max(w, h) * 0.75);
      g2.addColorStop(0, st.colors.WASH_B);
      g2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // vignette
      const vg = ctx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.2, w * 0.5, h * 0.5, Math.max(w, h) * 0.72);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.25)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);
    };

    const drawLinks = (cellSize, linkDist) => {
      const st = stateRef.current;
      const { w, h } = st;

      if (!link) return;

      // rebuild spatial hash once per frame (cheap)
      rebuildGrid(cellSize);

      ctx.save();
      ctx.strokeStyle = st.colors.LINK;
      ctx.lineWidth = 1;

      // check neighbors in nearby cells only (no flicker, no O(n^2))
      for (let i = 0; i < st.dots.length; i++) {
        const p = st.dots[i];
        const cx = Math.floor(p.x / cellSize);
        const cy = Math.floor(p.y / cellSize);

        let linksMade = 0;
        const maxLinks = 2;

        for (let gx = cx - 1; gx <= cx + 1 && linksMade < maxLinks; gx++) {
          for (let gy = cy - 1; gy <= cy + 1 && linksMade < maxLinks; gy++) {
            const bucket = st.grid.get(`${gx},${gy}`);
            if (!bucket) continue;

            for (let bi = 0; bi < bucket.length && linksMade < maxLinks; bi++) {
              const j = bucket[bi];
              if (j <= i) continue;

              const q = st.dots[j];
              const dx = p.x - q.x;
              const dy = p.y - q.y;
              const d = Math.hypot(dx, dy);

              if (d < linkDist) {
                const alpha = (1 - d / linkDist) * 0.55 * (0.45 + p.z);
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.stroke();
                linksMade++;
              }
            }
          }
        }
      }

      ctx.restore();

      // edge case safety
      ctx.globalAlpha = 1;
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, w, h);
    };

    const step = () => {
      const st = stateRef.current;
      const { w, h } = st;

      drawWash();

      // dynamic link distance based on viewport (feels consistent across screens)
      const linkDist = Math.max(90, Math.min(140, Math.sqrt((w * h) / 8000)));
      const cellSize = linkDist; // spatial hash size

      // gentle mouse “magnet”
      const mx = st.mouse.x;
      const my = st.mouse.y;
      const mouseActive = st.mouse.active && interactive;

      for (const p of st.dots) {
        // motion
        p.x += p.vx;
        p.y += p.vy;

        // mouse influence (very subtle)
        if (mouseActive && !reduceMotion) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const d = Math.hypot(dx, dy);
          const influence = Math.max(0, 1 - d / 180) * 0.22 * p.z;
          if (influence > 0) {
            p.x += dx * 0.006 * influence;
            p.y += dy * 0.006 * influence;
          }
        }

        // wrap
        const pad = 14;
        if (p.x < -pad) p.x = w + pad;
        if (p.x > w + pad) p.x = -pad;
        if (p.y < -pad) p.y = h + pad;
        if (p.y > h + pad) p.y = -pad;

        // dot
        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Links on top (skip if reduced motion)
      if (!reduceMotion) drawLinks(cellSize, linkDist);

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(step);
    };

    // init
    readTheme();
    resize();
    initDots();
    applyThemeToDots();
    rafRef.current = requestAnimationFrame(step);

    // theme watcher
    const mo = new MutationObserver(() => {
      readTheme();
      applyThemeToDots();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });

    // resize (rAF)
    let rr = 0;
    const onResize = () => {
      cancelAnimationFrame(rr);
      rr = requestAnimationFrame(() => {
        readTheme();
        resize();
        initDots();
        applyThemeToDots();
      });
    };
    window.addEventListener("resize", onResize, { passive: true });

    // pointer (optional)
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(rr);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      mo.disconnect();
    };
  }, [dotCount, speed, dotSize, link, interactive]);

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
