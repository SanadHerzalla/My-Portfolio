import { useEffect, useMemo, useRef, useState } from "react";

export default function SkillWheel({ skills, size = 560 }) {
  const ref = useRef(null);
  const [angle, setAngle] = useState(0); // degrees

  const ringThickness = 46;
  const radius = size / 2 - ringThickness; // where labels orbit
  const itemAngle = 360 / skills.length;

  // Arrow aims to the right (0deg)
  const selectedIndex = useMemo(() => {
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < skills.length; i++) {
      const a = ((i * itemAngle + angle) % 360 + 360) % 360;
      const dist = Math.min(a, 360 - a);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    return best;
  }, [angle, itemAngle, skills.length]);

  const selectedSkill = skills[selectedIndex];

  // Scroll rotate
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY) * 10;
      setAngle((a) => a - delta);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Drag rotate
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let dragging = false;
    let lastX = 0;

    const down = (e) => {
      dragging = true;
      lastX = e.clientX;
      el.setPointerCapture?.(e.pointerId);
    };

    const move = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      setAngle((a) => a + dx * 0.7);
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
  }, []);

  // gentle snap to nearest
  useEffect(() => {
    const id = setTimeout(() => {
      const target = -(selectedIndex * itemAngle);
      setAngle((a) => a + (target - a) * 0.18);
    }, 60);
    return () => clearTimeout(id);
  }, [selectedIndex, itemAngle]);

  return (
    <div className="grid gap-10 lg:grid-cols-[auto_1fr] items-center justify-items-center">
      {/* Circle */}
      <div
        ref={ref}
        className="relative select-none touch-none"
        style={{ width: size, height: size }}
      >
        {/* Outer ring (black -> gray) */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 180deg, #111111, #3a3a3a, #111111)",
            boxShadow: "0 20px 70px rgba(0,0,0,0.18)",
          }}
        />

        {/* Inner cutout (white glass) */}
        <div
          className="absolute rounded-full"
          style={{
            inset: ringThickness,
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0,0,0,0.10)",
          }}
        />

        {/* Labels orbiting close to ring */}
        {skills.map((s, i) => {
          const a = ((i * itemAngle + angle) * Math.PI) / 180;
          const x = Math.cos(a) * radius;
          const y = Math.sin(a) * radius;
          const isSelected = i === selectedIndex;

          return (
            <div
              key={s + i}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
              }}
            >
              <div
                className="px-3 py-1 text-sm whitespace-nowrap"
                style={{
                  borderRadius: 999,
                  border: isSelected
                    ? "1px solid rgba(0,0,0,0.55)"
                    : "1px solid rgba(0,0,0,0.12)",
                  background: isSelected
                    ? "linear-gradient(135deg, #111111, #3a3a3a)"
                    : "rgba(255,255,255,0.85)",
                  color: isSelected ? "#fff" : "#111",
                  boxShadow: isSelected ? "0 10px 30px rgba(0,0,0,0.18)" : "none",
                  transition: "all 180ms ease",
                }}
              >
                {s}
              </div>
            </div>
          );
        })}

        {/* Arrow on the border aiming at the ring (right side) */}
        <div
          className="absolute left-1/2 top-1/2 -translate-y-1/2"
          style={{ transform: `translate(${size / 2 - 18}px, -50%)` }}
        >
          <div className="relative">
            {/* line */}
            <div
              style={{
                width: 50,
                height: 2,
                background: "#111",
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            {/* triangle */}
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "10px solid transparent",
                borderBottom: "10px solid transparent",
                borderLeft: "16px solid #111",
              }}
            />
          </div>
        </div>
      </div>

      {/* Oval skill target (same color vibe as ring) */}
      <div className="w-full max-w-md">
        <div
          className="rounded-3xl p-6"
          style={{
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0,0,0,0.10)",
          }}
        >
          <p className="text-xs uppercase tracking-wider text-black/60">
            Highlighted skill
          </p>

          <div
            className="mt-3 inline-flex items-center px-5 py-3"
            style={{
              borderRadius: 999,
              background: "linear-gradient(135deg, #111111, #3a3a3a)",
              color: "#fff",
              border: "1px solid rgba(0,0,0,0.35)",
              boxShadow: "0 14px 45px rgba(0,0,0,0.20)",
            }}
          >
            <span className="text-lg font-semibold">{selectedSkill}</span>
          </div>

          <p className="mt-4 text-sm text-black/60">
            Scroll or drag the wheel to rotate.
          </p>
        </div>
      </div>
    </div>
  );
}
