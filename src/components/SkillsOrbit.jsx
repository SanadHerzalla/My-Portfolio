import { useEffect, useMemo, useRef, useState } from "react";

export default function SkillsOrbit({
  title = "FRONT END",
  items = ["React", "Angular", "TypeScript", "Sass", "HTML", "Webpack"],
  size = 560,
  autoRotate = true,
}) {
  const ref = useRef(null);
  const [angle, setAngle] = useState(0);

  const ringRadius = size / 2 - 26;
  const centerSize = Math.floor(size * 0.66);
  const itemAngle = 360 / items.length;

  useEffect(() => {
    if (!autoRotate) return;
    let raf = 0;
    const tick = () => {
      setAngle((a) => a + 0.06);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoRotate]);

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

  const nodes = useMemo(() => {
    return items.map((name, i) => {
      const a = ((i * itemAngle + angle) * Math.PI) / 180;
      const x = Math.cos(a) * ringRadius;
      const y = Math.sin(a) * ringRadius;
      return { name, x, y };
    });
  }, [items, itemAngle, angle, ringRadius]);

  return (
    <div className="flex justify-center">
      <div
        ref={ref}
        className="relative select-none touch-none"
        style={{ width: size, height: size }}
      >
        {/* orbit ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid rgba(0,0,0,0.45)" }}
        />

        {/* center circle */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center"
          style={{
            width: centerSize,
            height: centerSize,
            background: "radial-gradient(circle at 30% 30%, #1f2937, #0b0f1a)",
            boxShadow: "0 22px 60px rgba(0,0,0,0.18)",
          }}
        >
          <div className="text-white text-4xl font-semibold tracking-wide">
            {title}
          </div>
        </div>

        {/* nodes */}
        {nodes.map((n) => (
          <div
            key={n.name}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(${n.x}px, ${n.y}px) translate(-50%, -50%)`,
            }}
            title={n.name}
          >
            <div
              className="h-14 w-14 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #0b0f1a, #374151)",
                border: "1px solid rgba(0,0,0,0.45)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
              }}
            >
              <span className="text-white text-xs font-semibold">
                {n.name.length > 2 ? n.name.slice(0, 2).toUpperCase() : n.name.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
