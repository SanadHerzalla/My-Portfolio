import { useEffect, useRef } from "react";

/**
 * AuroraBackground
 * - Animated aurora orbs (CSS keyframes, theme-reactive)
 * - Canvas particle layer: glowing dots + rotating squares
 * - Mouse parallax on orbs
 * - Reduced-motion safe
 */
export default function AuroraBackground({ interactive = true }) {
  const orbsRef = useRef([]);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef(0);
  const orbRafRef = useRef(0);

  /* ── Orb parallax ── */
  useEffect(() => {
    if (!interactive) return;
    const onMove = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const tick = () => {
      const mx = mouseRef.current.x - 0.5;
      const my = mouseRef.current.y - 0.5;
      orbsRef.current.forEach((orb, i) => {
        if (!orb) return;
        const d = [0.55, 0.9, 0.7, 0.4][i] ?? 0.6;
        orb.style.setProperty("--px", `${mx * 32 * d}px`);
        orb.style.setProperty("--py", `${my * 24 * d}px`);
      });
      orbRafRef.current = requestAnimationFrame(tick);
    };
    orbRafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(orbRafRef.current);
    };
  }, [interactive]);

  /* ── Canvas particles ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    const rand = (a, b) => Math.random() * (b - a) + a;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const getDPR = () => clamp(window.devicePixelRatio || 1, 1, 2);

    /* ── Read theme colours directly ── */
    const isDark = () => document.documentElement.classList.contains("dark");

    /* Returns [r,g,b] arrays for particle palette based on current theme */
    const getPalette = () => {
      if (isDark()) {
        return {
          dots: [
            [34, 211, 238], // cyan accent
            [99, 102, 241], // indigo
            [168, 85, 247], // violet
            [226, 232, 240], // slate-200 (light)
          ],
          squares: [
            [34, 211, 238], // cyan
            [99, 102, 241], // indigo
          ],
          linkColor: [99, 102, 241],
        };
      }
      return {
        dots: [
          [59, 130, 246], // blue
          [99, 102, 241], // indigo
          [168, 85, 247], // violet
          [15, 23, 42], // dark slate
        ],
        squares: [
          [59, 130, 246], // blue
          [168, 85, 247], // violet
        ],
        linkColor: [99, 102, 241],
      };
    };

    let W = 0,
      H = 0,
      dpr = 1;
    let particles = [];

    const resize = () => {
      dpr = getDPR();
      W = document.documentElement.clientWidth;
      H = document.documentElement.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const makeParticle = () => {
      const pal = getPalette();
      const shape = Math.random() < 0.6 ? "dot" : "square";
      const size = shape === "dot" ? rand(1.8, 4.0) : rand(2.5, 5.5);
      const speed = reduceMotion ? 0 : rand(0.1, 0.4);
      const angle = rand(0, Math.PI * 2);
      const colorArr =
        shape === "dot"
          ? pal.dots[Math.floor(Math.random() * pal.dots.length)]
          : pal.squares[Math.floor(Math.random() * pal.squares.length)];
      return {
        x: rand(0, W),
        y: rand(0, H),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        shape,
        color: colorArr,
        /* dots are brighter, squares slightly dimmer */
        alpha: shape === "dot" ? rand(0.45, 0.85) : rand(0.3, 0.6),
        rotation: rand(0, Math.PI * 2),
        rotSpeed: reduceMotion ? 0 : rand(-0.012, 0.012),
        /* each particle has a slow pulse */
        pulse: rand(0, Math.PI * 2),
        pulseSpeed: rand(0.008, 0.022),
      };
    };

    const initParticles = () => {
      const count = clamp(Math.floor((W * H) / 12000), 50, 180);
      particles = Array.from({ length: count }, makeParticle);
    };

    const drawDot = (p, alpha) => {
      const [r, g, b] = p.color;

      /* glow halo */
      const glow = ctx.createRadialGradient(
        p.x,
        p.y,
        0,
        p.x,
        p.y,
        p.size * 3.5,
      );
      glow.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.55})`);
      glow.addColorStop(0.4, `rgba(${r},${g},${b},${alpha * 0.18})`);
      glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
      ctx.fill();

      /* solid core */
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawSquare = (p, alpha) => {
      const [r, g, b] = p.color;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      const h = p.size / 2;

      /* subtle outer glow for squares too */
      ctx.shadowColor = `rgba(${r},${g},${b},${alpha * 0.6})`;
      ctx.shadowBlur = p.size * 2.5;
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fillRect(-h, -h, p.size, p.size);
      ctx.shadowBlur = 0;
      ctx.restore();
    };

    const drawLinks = () => {
      const pal = getPalette();
      const [r, g, b] = pal.linkColor;
      const linkDist = Math.max(85, Math.min(125, Math.sqrt((W * H) / 9000)));

      for (let i = 0; i < particles.length; i++) {
        let links = 0;
        for (let j = i + 1; j < particles.length && links < 2; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            const a = (1 - d / linkDist) * 0.18;
            ctx.save();
            ctx.globalAlpha = a;
            ctx.strokeStyle = `rgba(${r},${g},${b},1)`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
            links++;
          }
        }
      }
    };

    const pad = 20;
    const frame = () => {
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        /* move */
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.pulse += p.pulseSpeed;

        /* wrap */
        if (p.x < -pad) p.x = W + pad;
        if (p.x > W + pad) p.x = -pad;
        if (p.y < -pad) p.y = H + pad;
        if (p.y > H + pad) p.y = -pad;

        /* pulsing alpha */
        const pulseAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

        if (p.shape === "dot") drawDot(p, pulseAlpha);
        else drawSquare(p, pulseAlpha);
      }

      if (!reduceMotion) drawLinks();

      rafRef.current = requestAnimationFrame(frame);
    };

    /* init */
    resize();
    initParticles();
    rafRef.current = requestAnimationFrame(frame);

    let rr = 0;
    const onResize = () => {
      cancelAnimationFrame(rr);
      rr = requestAnimationFrame(() => {
        resize();
        initParticles();
      });
    };
    window.addEventListener("resize", onResize, { passive: true });

    /* re-init particles on theme change so colours update */
    const mo = new MutationObserver(() => {
      initParticles();
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(rr);
      window.removeEventListener("resize", onResize);
      mo.disconnect();
    };
  }, []);

  const orbs = [
    { cx: 18, cy: 18, size: 680, cls: "orb-a", delay: "0s" },
    { cx: 80, cy: 14, size: 580, cls: "orb-b", delay: "-4s" },
    { cx: 68, cy: 78, size: 720, cls: "orb-c", delay: "-8s" },
    { cx: 8, cy: 82, size: 500, cls: "orb-d", delay: "-12s" },
  ];

  return (
    <>
      <style>{`
        @keyframes driftA { 0%,100%{transform:translate(calc(-50% + var(--px,0px)),calc(-50% + var(--py,0px))) scale(1)} 33%{transform:translate(calc(-50% + var(--px,0px) + 40px),calc(-50% + var(--py,0px) - 30px)) scale(1.08)} 66%{transform:translate(calc(-50% + var(--px,0px) - 25px),calc(-50% + var(--py,0px) + 20px)) scale(0.95)} }
        @keyframes driftB { 0%,100%{transform:translate(calc(-50% + var(--px,0px)),calc(-50% + var(--py,0px))) scale(1)} 40%{transform:translate(calc(-50% + var(--px,0px) - 35px),calc(-50% + var(--py,0px) + 45px)) scale(1.12)} 70%{transform:translate(calc(-50% + var(--px,0px) + 20px),calc(-50% + var(--py,0px) - 15px)) scale(0.92)} }
        @keyframes driftC { 0%,100%{transform:translate(calc(-50% + var(--px,0px)),calc(-50% + var(--py,0px))) scale(1)} 30%{transform:translate(calc(-50% + var(--px,0px) + 28px),calc(-50% + var(--py,0px) + 35px)) scale(1.06)} 65%{transform:translate(calc(-50% + var(--px,0px) - 40px),calc(-50% + var(--py,0px) - 20px)) scale(0.97)} }
        @keyframes driftD { 0%,100%{transform:translate(calc(-50% + var(--px,0px)),calc(-50% + var(--py,0px))) scale(1)} 45%{transform:translate(calc(-50% + var(--px,0px) + 50px),calc(-50% + var(--py,0px) - 40px)) scale(1.10)} 75%{transform:translate(calc(-50% + var(--px,0px) - 18px),calc(-50% + var(--py,0px) + 28px)) scale(0.94)} }
        @keyframes opA { 0%,100%{opacity:.50} 50%{opacity:.75} }
        @keyframes opB { 0%,100%{opacity:.40} 50%{opacity:.68} }
        @keyframes opC { 0%,100%{opacity:.45} 50%{opacity:.72} }
        @keyframes opD { 0%,100%{opacity:.35} 50%{opacity:.60} }
        @keyframes gridDrift { 0%{transform:translate(0,0)} 100%{transform:translate(72px,72px)} }

        .aurora-orb { position:absolute; border-radius:50%; will-change:transform,opacity; --px:0px; --py:0px; }
        .orb-a { animation: driftA 18s ease-in-out infinite, opA  9s ease-in-out infinite; }
        .orb-b { animation: driftB 22s ease-in-out infinite, opB 11s ease-in-out infinite; }
        .orb-c { animation: driftC 19s ease-in-out infinite, opC 10s ease-in-out infinite; }
        .orb-d { animation: driftD 25s ease-in-out infinite, opD 13s ease-in-out infinite; }

        :root {
          --orb-0: radial-gradient(circle at 40% 40%, rgba(99,102,241,.50), rgba(139,92,246,.18) 60%, transparent);
          --orb-1: radial-gradient(circle at 60% 35%, rgba(168,85,247,.45), rgba(236,72,153,.15) 60%, transparent);
          --orb-2: radial-gradient(circle at 50% 55%, rgba(59,130,246,.40), rgba(99,102,241,.12) 60%, transparent);
          --orb-3: radial-gradient(circle at 40% 60%, rgba(236,72,153,.35), rgba(168,85,247,.12) 60%, transparent);
        }
        html.dark {
          --orb-0: radial-gradient(circle at 40% 40%, rgba(34,211,238,.40), rgba(99,102,241,.20) 60%, transparent);
          --orb-1: radial-gradient(circle at 60% 35%, rgba(99,102,241,.38), rgba(168,85,247,.16) 60%, transparent);
          --orb-2: radial-gradient(circle at 50% 55%, rgba(168,85,247,.34), rgba(34,211,238,.14) 60%, transparent);
          --orb-3: radial-gradient(circle at 40% 60%, rgba(34,211,238,.28), rgba(99,102,241,.12) 60%, transparent);
        }
        @media (prefers-reduced-motion: reduce) {
          .aurora-orb { animation: none !important; }
          .aurora-grid { animation: none !important; }
        }
      `}</style>

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
          background: "var(--bg-canvas)",
        }}
      >
        {/* aurora orbs */}
        {orbs.map((o, i) => (
          <div
            key={i}
            ref={(el) => (orbsRef.current[i] = el)}
            className={`aurora-orb ${o.cls}`}
            style={{
              left: `${o.cx}%`,
              top: `${o.cy}%`,
              width: o.size,
              height: o.size,
              background: `var(--orb-${i})`,
              filter: `blur(${68 + i * 8}px)`,
              animationDelay: o.delay,
              transform: "translate(-50%,-50%)",
            }}
          />
        ))}

        {/* animated grid */}
        <div
          className="aurora-grid"
          style={{
            position: "absolute",
            inset: "-72px",
            backgroundImage: `linear-gradient(rgba(var(--fg),.022) 1px,transparent 1px),linear-gradient(90deg,rgba(var(--fg),.022) 1px,transparent 1px)`,
            backgroundSize: "72px 72px",
            animation: "gridDrift 28s linear infinite",
          }}
        />

        {/* particle canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        />

        {/* noise grain */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.038,
            mixBlendMode: "overlay",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <filter id="aurora-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.68"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#aurora-noise)" />
        </svg>

        {/* vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            background:
              "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 35%, rgba(0,0,0,.08) 100%)",
          }}
        />
      </div>
    </>
  );
}
