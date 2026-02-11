import { useEffect, useMemo, useRef, useState } from "react";

export default function SkillsRadar({ categories, size = 720, onFinished }) {
  const wrapRef = useRef(null);

  const [done, setDone] = useState(false);
  const [catIndex, setCatIndex] = useState(0);

  const [angle, setAngle] = useState(0);
  const velRef = useRef(0);
  const rafRef = useRef(0);

  const [transitioning, setTransitioning] = useState(false);
  const visitedRef = useRef(new Set());

  const lockRef = useRef(false);

  // ✅ Responsive size
  const [autoSize, setAutoSize] = useState(size);

  // ✅ Modern UX
  const [ghostAngle, setGhostAngle] = useState(0);
  const [progress, setProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(!!mq?.matches);
    apply();
    mq?.addEventListener?.("change", apply);
    return () => mq?.removeEventListener?.("change", apply);
  }, []);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      const s = Math.max(280, Math.min(size, w - 32));
      setAutoSize(s);
    };
    calc();
    window.addEventListener("resize", calc, { passive: true });
    return () => window.removeEventListener("resize", calc);
  }, [size]);

  const current = categories[catIndex];
  const items = current.items;

  const R = autoSize / 2;
  const ringR = R * 0.82;

  const stepDeg = 360 / items.length;
  const targetDeg = 270; // top

  const nodes = useMemo(() => {
    return items.map((name, i) => {
      const a = ((i * stepDeg + angle) * Math.PI) / 180;
      return { name, x: Math.cos(a) * ringR, y: Math.sin(a) * ringR };
    });
  }, [items, stepDeg, angle, ringR]);

  const activeIndex = useMemo(() => {
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < items.length; i++) {
      const a = ((i * stepDeg + angle) % 360 + 360) % 360;
      const distRaw = Math.abs(a - targetDeg);
      const dist = Math.min(distRaw, 360 - distRaw);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    return best;
  }, [items.length, stepDeg, angle]);

  // mark visited
  const lastActiveRef = useRef(-1);
  useEffect(() => {
    if (done || transitioning) return;

    if (lastActiveRef.current !== activeIndex) {
      lastActiveRef.current = activeIndex;
      visitedRef.current.add(activeIndex);
      setProgress(visitedRef.current.size / Math.max(1, items.length));
    }

    if (visitedRef.current.size === items.length) {
      goNextCategory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, done, transitioning, catIndex]);

  const goNextCategory = async () => {
    if (transitioning) return;

    if (catIndex < categories.length - 1) {
      setTransitioning(true);
      await new Promise((r) => setTimeout(r, 220));

      visitedRef.current = new Set();
      lastActiveRef.current = -1;
      velRef.current = 0;
      setAngle(0);
      setGhostAngle(0);
      setProgress(0);
      setCatIndex((i) => i + 1);

      await new Promise((r) => setTimeout(r, 140));
      setTransitioning(false);
    } else {
      setDone(true);
      velRef.current = 0;
      lockRef.current = false;
      onFinished?.();
    }
  };

  // ✅ lock when mostly visible
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || done) return;
  
    const io = new IntersectionObserver(
      (entries) => {
        const v = entries[0]?.isIntersecting;
        lockRef.current = !!v;
      },
      { threshold: 0.55 }
    );
  
    io.observe(el);
    return () => io.disconnect();
  }, [done]);

  
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        lockRef.current = false;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ✅ smooth loop + ghostAngle lerp (no shape breaking)
  useEffect(() => {
    const tick = () => {
      velRef.current *= reduceMotion ? 0.85 : 0.9;
      if (Math.abs(velRef.current) < 0.006) velRef.current = 0;

      const idle = done || transitioning || reduceMotion ? 0 : 0.22;
      if (!done && !transitioning) setAngle((a) => a + idle + velRef.current);

      // lerp ghost sweep
      setGhostAngle((g) => {
        const diff = angle - g;
        return g + diff * (reduceMotion ? 0.25 : 0.16);
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [done, transitioning, reduceMotion, angle]);

  // ✅ wheel scroll controls rotation (smooth)
  useEffect(() => {
    const onWheel = (e) => {
      if (!lockRef.current || done || transitioning) return;
      e.preventDefault();
      const delta = Math.max(-80, Math.min(80, e.deltaY));
      velRef.current += delta * 0.012;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [done, transitioning]);

  // ✅ drag rotate (touch + mouse)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let axis = null;
    const AXIS_LOCK_THRESHOLD = 6;

    const down = (e) => {
      if (!lockRef.current || done || transitioning) return;
      dragging = true;
      axis = null;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture?.(e.pointerId);
    };

    const move = (e) => {
      if (!dragging) return;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      if (!axis) {
        if (Math.abs(dx) + Math.abs(dy) < AXIS_LOCK_THRESHOLD) return;
        axis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
      }

      const isTouch = e.pointerType === "touch";
      const base = axis === "x" ? dx : isTouch ? -dy : dx;
      const clamped = Math.max(-28, Math.min(28, base));
      velRef.current += clamped * 0.028;
    };

    const up = () => {
      dragging = false;
      axis = null;
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);

    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [done, transitioning]);

  const activeName = items[activeIndex];

  return (
    <div
      ref={wrapRef}
      className="relative flex justify-center items-center w-full"
      style={{ minHeight: autoSize }}
    >
      <div
        className="relative"
        style={{
          width: autoSize,
          height: autoSize,
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "scale(0.985)" : "scale(1)",
          transition: "opacity 220ms ease, transform 220ms ease",
          touchAction: "pan-y",
        }}
      >
        {/* radar body */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, var(--radar-bg-a), var(--radar-bg-b))`,
            border: `1px solid var(--radar-ring)`,
            boxShadow: `0 30px 90px rgba(0,0,0,0.45)`,
            overflow: "hidden",
          }}
        >
          {/* rings */}
          {[0.25, 0.5, 0.75, 1].map((k) => (
            <div
              key={k}
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: autoSize * k,
                height: autoSize * k,
                transform: "translate(-50%, -50%)",
                border: `1px solid var(--radar-ring)`,
                opacity: 0.55,
              }}
            />
          ))}

          {/* sweep glow (smooth) */}
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              width: autoSize,
              height: autoSize,
              transform: `translate(-50%, -50%) rotate(${ghostAngle}deg)`,
              background: `conic-gradient(
                from 180deg,
                rgba(var(--accent), 0),
                rgba(var(--accent), 0.20),
                rgba(var(--accent), 0)
              )`,
              opacity: reduceMotion ? 0.7 : 0.92,
              willChange: "transform",
            }}
          />

          {/* ✅ 2026 progress ring (masked) */}
          <div
            className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
            style={{
              width: autoSize * 0.92,
              height: autoSize * 0.92,
              transform: "translate(-50%, -50%)",
              background: `conic-gradient(
                rgba(var(--accent), 0.85) ${Math.floor(progress * 360)}deg,
                rgba(var(--accent), 0.10) 0deg
              )`,
              WebkitMask:
                "radial-gradient(circle, transparent 62%, #000 64%)",
              mask: "radial-gradient(circle, transparent 62%, #000 64%)",
              opacity: done ? 0.9 : 0.65,
              filter: "drop-shadow(0 0 14px rgba(var(--accent), 0.20))",
            }}
          />

          {/* ✅ center badge (FIXED: no Tailwind translate conflict) */}
          <div
            className="absolute left-1/2 top-1/2 text-center"
            style={{
              transform: "translate(-50%, -50%)",
              width: autoSize * 0.42,
              height: autoSize * 0.42,
              borderRadius: 999,
              background: `rgba(var(--card-bg))`,
              border: `1px solid rgba(var(--card-border))`,
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
              color: `rgb(var(--fg))`,
              padding: 12,
            }}
          >
            <div>
              <div className="text-2xl md:text-3xl font-semibold tracking-wide">
                {current.title.toUpperCase()}
              </div>
              <div
                style={{ color: `rgba(var(--muted))` }}
                className="mt-2 text-xs md:text-sm"
              >
                {done ? "Done — scroll down" : "Scroll / drag to rotate"}
              </div>

              {/* modern HUD line */}
              <div
                className="mt-3 rounded-2xl px-3 py-2 text-sm font-semibold"
                style={{
                  background: `rgba(var(--accent), 0.10)`,
                  border: `1px solid rgba(var(--accent), 0.22)`,
                  color: `rgb(var(--fg))`,
                }}
              >
                <span style={{ color: `rgba(var(--muted))` }}>Active:</span>{" "}
                {activeName}
              </div>

              <div
                className="mt-2 text-[11px] tracking-wide"
                style={{ color: `rgba(var(--muted))` }}
              >
                {visitedRef.current.size}/{items.length} explored
              </div>
            </div>
          </div>
        </div>

        {/* scanner pointer */}
        <div
          className="absolute left-1/2 top-1/2 pointer-events-none"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: ringR,
              height: 2,
              transform: "translate(0, -50%) rotate(-90deg)",
              transformOrigin: "0% 50%",
              background: `linear-gradient(
                90deg,
                rgba(var(--accent), 0),
                rgba(var(--accent), 0.92)
              )`,
              filter: `drop-shadow(0 0 12px rgba(var(--accent), 0.35))`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) translateY(${-ringR}px)`,
              width: 18,
              height: 18,
              borderRadius: 999,
              border: `2px solid rgba(var(--accent), 0.72)`,
              boxShadow: `0 0 18px rgba(var(--accent), 0.30)`,
              animation: reduceMotion ? "none" : `pulseAim 900ms ease-in-out infinite`,
              background: `rgba(var(--accent), 0.08)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) translateY(${-ringR}px)`,
              width: 6,
              height: 6,
              borderRadius: 999,
              background: `rgba(var(--accent), 0.95)`,
              boxShadow: `0 0 10px rgba(var(--accent), 0.35)`,
            }}
          />
        </div>

        {/* border pills */}
        {nodes.map((n, i) => {
          const isCurrent = i === activeIndex;
          const isVisited = visitedRef.current.has(i);

          return (
            <div
              key={n.name}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(${n.x}px, ${n.y}px) translate(-50%, -50%)`,
              }}
            >
              <div
                className="px-4 md:px-6 py-2 md:py-2.5 rounded-full whitespace-nowrap font-semibold"
                style={{
                  fontSize: isCurrent ? 14 : 12,
                  background: isCurrent
                    ? `rgba(var(--accent), 0.14)`
                    : `rgba(var(--card-bg))`,
                  border: isCurrent
                    ? `1px solid rgba(var(--accent), 0.35)`
                    : `1px solid rgba(var(--card-border))`,
                  color: isCurrent ? `rgb(var(--fg))` : `rgba(var(--muted))`,
                  boxShadow: isCurrent
                    ? `0 18px 60px rgba(var(--accent), 0.18)`
                    : "0 10px 28px rgba(0,0,0,0.25)",
                  transform: isCurrent
                    ? "scale(1.18)"
                    : isVisited
                    ? "scale(1.03)"
                    : "scale(1)",
                  transition: reduceMotion ? "none" : "all 220ms ease",
                  opacity: isVisited ? 1 : 0.9,
                }}
              >
                {n.name}
              </div>
            </div>
          );
        })}

        <style>{`
          @keyframes pulseAim {
            0%   { transform: translate(-50%, -50%) translateY(-${ringR}px) scale(0.95); opacity: 0.65; }
            50%  { transform: translate(-50%, -50%) translateY(-${ringR}px) scale(1.18); opacity: 1; }
            100% { transform: translate(-50%, -50%) translateY(-${ringR}px) scale(0.95); opacity: 0.65; }
          }
        `}</style>
      </div>
    </div>
  );
}
