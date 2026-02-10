import { useEffect, useRef, useState } from "react";

export default function SkillsSnap3D({ categories }) {
  const sectionRef = useRef(null);
  const [catIndex, setCatIndex] = useState(0);
  const [skillIndex, setSkillIndex] = useState(0);
  const visitedRef = useRef(new Set());
  const [locked, setLocked] = useState(false);

  const current = categories[catIndex];
  const skills = current.items;

  // lock page when inside section
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const fullyVisible =
        rect.top <= 0 && rect.bottom >= window.innerHeight;

      setLocked(fullyVisible);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // wheel controls 3D carousel
  useEffect(() => {
    const onWheel = (e) => {
      if (!locked) return;

      e.preventDefault();

      if (e.deltaY > 0) {
        goNext();
      } else {
        goPrev();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => window.removeEventListener("wheel", onWheel);
  }, [locked, skillIndex, catIndex]);

  const goNext = () => {
    if (skillIndex < skills.length - 1) {
      setSkillIndex((i) => i + 1);
      visitedRef.current.add(skillIndex + 1);
    } else {
      // move to next category
      if (catIndex < categories.length - 1) {
        setCatIndex((c) => c + 1);
        setSkillIndex(0);
        visitedRef.current = new Set([0]);
      } else {
        // unlock scroll
        setLocked(false);
      }
    }
  };

  const goPrev = () => {
    if (skillIndex > 0) {
      setSkillIndex((i) => i - 1);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="text-center absolute top-16">
        <h2 className="text-4xl font-semibold text-white">
          {current.title}
        </h2>
        <p className="text-white/60 mt-2">
          Scroll to explore
        </p>
      </div>

      {/* 3D Carousel */}
      <div
        className="relative w-full flex items-center justify-center"
        style={{ perspective: 1200 }}
      >
        {skills.map((skill, i) => {
          const offset = i - skillIndex;
          const abs = Math.abs(offset);

          return (
            <div
              key={skill}
              className="absolute px-8 py-3 rounded-full font-semibold text-lg"
              style={{
                transform: `
                  translateX(${offset * 260}px)
                  rotateY(${offset * -35}deg)
                  scale(${i === skillIndex ? 1.2 : 1 - abs * 0.15})
                `,
                opacity: abs > 3 ? 0 : 1,
                background:
                  i === skillIndex
                    ? "rgba(34,211,238,0.15)"
                    : "rgba(255,255,255,0.06)",
                border:
                  i === skillIndex
                    ? "1px solid rgba(34,211,238,0.35)"
                    : "1px solid rgba(255,255,255,0.15)",
                color: "white",
                transition: "all 450ms cubic-bezier(.22,1,.36,1)",
                boxShadow:
                  i === skillIndex
                    ? "0 30px 90px rgba(34,211,238,0.3)"
                    : "0 15px 40px rgba(0,0,0,0.5)",
              }}
            >
              {skill}
            </div>
          );
        })}
      </div>
    </section>
  );
}
