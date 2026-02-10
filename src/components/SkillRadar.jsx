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

  const current = categories[catIndex];
  const items = current.items;

  const R = size / 2;
  const ringR = R * 0.82;

  const stepDeg = 360 / items.length;
  const targetDeg = 270; // top

  // pills on border ring
  const nodes = useMemo(() => {
    return items.map((name, i) => {
      const a = ((i * stepDeg + angle) * Math.PI) / 180;
      return { name, x: Math.cos(a) * ringR, y: Math.sin(a) * ringR };
    });
  }, [items, stepDeg, angle, ringR]);

  // current = closest to target (top)
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
  useEffect(() => {
    if (done || transitioning) return;

    visitedRef.current.add(activeIndex);

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
      velRef.current = 0;
      setAngle(0);
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

  // lock only when fully visible
  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el || done) return;

      const rect = el.getBoundingClientRect();
      const fullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      lockRef.current = fullyVisible;
    };

    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [done]);

  // smooth loop
  useEffect(() => {
    const tick = () => {
      velRef.current *= 0.9;
      if (Math.abs(velRef.current) < 0.01) velRef.current = 0;

      const idle = done ? 0 : 0.2;
      if (!done && !transitioning) {
        setAngle((a) => a + idle + velRef.current);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [done, transitioning]);

  // wheel scroll controls rotation
  useEffect(() => {
    const onWheel = (e) => {
      if (!lockRef.current || done) return;
      e.preventDefault();
      if (transitioning) return;
      velRef.current += e.deltaY * 0.015;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [done, transitioning]);

  // drag rotate
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let dragging = false;
    let lastX = 0;

    const down = (e) => {
      if (!lockRef.current || done || transitioning) return;
      dragging = true;
      lastX = e.clientX;
      el.setPointerCapture?.(e.pointerId);
    };

    const move = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      velRef.current += dx * 0.03;
    };

    const up = () => (dragging = false);

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

  return (
    <div
      ref={wrapRef}
      className="relative flex justify-center items-center w-full"
      style={{ minHeight: size }}
    >
      <div
        className="relative"
        style={{
          width: size,
          height: size,
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "scale(0.985)" : "scale(1)",
          transition: "opacity 220ms ease, transform 220ms ease",
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
                width: size * k,
                height: size * k,
                transform: "translate(-50%, -50%)",
                border: `1px solid var(--radar-ring)`,
                opacity: 0.55,
              }}
            />
          ))}

          {/* sweep glow (theme aware) */}
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              width: size,
              height: size,
              transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              background: `conic-gradient(
                from 180deg,
                rgba(var(--accent), 0),
                rgba(var(--accent), 0.18),
                rgba(var(--accent), 0)
              )`,
              opacity: 0.9,
            }}
          />

          {/* center badge */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
            style={{
              width: size * 0.42,
              height: size * 0.42,
              borderRadius: 999,
              background: `rgba(var(--card-bg))`,
              border: `1px solid rgba(var(--card-border))`,
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
              color: `rgb(var(--fg))`,
            }}
          >
            <div>
              <div className="text-3xl font-semibold tracking-wide">
                {current.title.toUpperCase()}
              </div>
              <div style={{ color: `rgba(var(--muted))` }} className="mt-2 text-sm">
                {done ? "Done — scroll down" : "Scroll / drag to rotate"}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ scanner pointer aiming at CURRENT tech (top) */}
        <div
          className="absolute left-1/2 top-1/2 pointer-events-none"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          {/* arm */}
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

          {/* tip ring */}
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
              animation: `pulseAim 900ms ease-in-out infinite`,
              background: `rgba(var(--accent), 0.08)`,
            }}
          />

          {/* inner dot */}
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

        {/* border ovals */}
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
                className="px-6 py-2.5 rounded-full whitespace-nowrap font-semibold"
                style={{
                  fontSize: isCurrent ? 15 : 13,
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
                  transform: isCurrent ? "scale(1.22)" : isVisited ? "scale(1.03)" : "scale(1)",
                  transition: "all 220ms ease",
                  opacity: isVisited ? 1 : 0.9,
                }}
              >
                {n.name}
              </div>
            </div>
          );
        })}

        {/* keyframes */}
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
