import { useEffect, useMemo, useRef, useState } from "react";

export default function SkillsWheelStepper({ categories, size = 700, onFinished }) {
  const wrapRef = useRef(null);

  const [isActive, setIsActive] = useState(false);
  const [done, setDone] = useState(false);

  const [catIndex, setCatIndex] = useState(0);
  const [angle, setAngle] = useState(0);

  const velocityRef = useRef(0);
  const rafRef = useRef(0);
  const visitedRef = useRef(new Set());
  const [transitioning, setTransitioning] = useState(false);

  const current = categories[catIndex];
  const items = current.items;

  const ringRadius = size / 2 - 70;
  const centerSize = Math.floor(size * 0.62);

  const stepDeg = 360 / items.length;

  // "Current" tech = closest to top (12 o'clock) so user can understand
  // (feel free to change target from top to right by changing targetDeg)
  const targetDeg = 270; // 270deg = top

  const currentIndex = useMemo(() => {
    let best = 0;
    let bestDist = Infinity;

    for (let i = 0; i < items.length; i++) {
      const a = ((i * stepDeg + angle) % 360 + 360) % 360; // 0..359
      const distRaw = Math.abs(a - targetDeg);
      const dist = Math.min(distRaw, 360 - distRaw);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    return best;
  }, [angle, stepDeg, items.length]);

  const nodes = useMemo(() => {
    return items.map((name, i) => {
      const a = ((i * stepDeg + angle) * Math.PI) / 180;
      return { name, x: Math.cos(a) * ringRadius, y: Math.sin(a) * ringRadius };
    });
  }, [items, stepDeg, angle, ringRadius]);

  // active detection
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { threshold: 0.55 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // mark visited when current changes
  useEffect(() => {
    if (!isActive || done || transitioning) return;

    visitedRef.current.add(currentIndex);

    // switch ONLY when visited all items in this category
    if (visitedRef.current.size === items.length) {
      goNextCategory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isActive, done, transitioning, catIndex]);

  const goNextCategory = async () => {
    if (transitioning) return;

    if (catIndex < categories.length - 1) {
      setTransitioning(true);
      await new Promise((r) => setTimeout(r, 220));

      visitedRef.current = new Set();
      velocityRef.current = 0;
      setAngle(0);
      setCatIndex((i) => i + 1);

      await new Promise((r) => setTimeout(r, 140));
      setTransitioning(false);
    } else {
      setDone(true);
      velocityRef.current = 0;
      onFinished?.();
    }
  };

  // inertial loop
  useEffect(() => {
    const tick = () => {
      velocityRef.current *= 0.90;
      if (Math.abs(velocityRef.current) < 0.01) velocityRef.current = 0;

      if (velocityRef.current !== 0 && !done && !transitioning) {
        setAngle((a) => a + velocityRef.current);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [done, transitioning]);

  // consume wheel while active
  useEffect(() => {
    const onWheel = (e) => {
      if (!isActive || done) return;
      e.preventDefault();
      if (transitioning) return;

      velocityRef.current += e.deltaY * 0.015;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [isActive, done, transitioning]);

  // drag
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let dragging = false;
    let lastX = 0;

    const down = (e) => {
      if (!isActive || done || transitioning) return;
      dragging = true;
      lastX = e.clientX;
      el.setPointerCapture?.(e.pointerId);
    };

    const move = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      velocityRef.current += dx * 0.03;
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
  }, [isActive, done, transitioning]);


  return (
    <div ref={wrapRef} className="select-none touch-none flex justify-center">
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
        {/* orbit ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid rgba(176,137,104,0.25)" }}

        />

        {/* center */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center"
          style={{
            width: centerSize,
            height: centerSize,
            background: "radial-gradient(circle at 30% 30%, #1f2937, #0b0f1a)",
            boxShadow: "0 22px 60px rgba(0,0,0,0.18)",
          }}
        >
          <div className="text-center px-8">
            <div className="text-white text-4xl font-semibold tracking-wide">
              {current.title.toUpperCase()}
            </div>

            <div className="mt-4 text-white/70 text-sm">
              {done ? "Done — scroll down" : "Scroll / drag to rotate"}
            </div>
          </div>
        </div>

        {/* pills */}
        {nodes.map((n, i) => {
          const isCurrent = i === currentIndex;
          const isVisited = visitedRef.current.has(i);

          return (
            <div
              key={n.name}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(${n.x}px, ${n.y}px) translate(-50%, -50%)`,
              }}
              title={n.name}
            >
              <div
                className="px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium"
                style={{
                  background: "linear-gradient(135deg, rgba(11,15,26,0.92), rgba(55,65,81,0.92))",
                  border: isCurrent
                    ? "1px solid rgba(0,0,0,0.65)"
                    : "1px solid rgba(0,0,0,0.30)",
                  color: "#fff",
                  boxShadow: isCurrent
                  ? "0 20px 60px rgba(176,137,104,0.35), 0 18px 46px rgba(0,0,0,0.22)"
                  : "0 10px 26px rgba(0,0,0,0.12)",
                  transform: isCurrent ? "scale(1.18)" : "scale(1)",
                  opacity: isVisited ? 1 : 0.88,
                  transition: "transform 220ms ease, box-shadow 220ms ease, opacity 220ms ease",
                }}
              >
                {n.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
