import { useState, useEffect } from "react";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";

function useAccentRgb() {
  const [rgb, setRgb] = useState([59, 130, 246]);

  useEffect(() => {
    const read = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim();
      if (raw) {
        const parts = raw
          .split(/\s+/)
          .map(Number)
          .filter((n) => !isNaN(n));
        if (parts.length === 3) setRgb(parts);
      }
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return rgb;
}

function TechPill({ label, rgb }) {
  const [hovered, setHovered] = useState(false);
  const [r, g, b] = rgb;
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 13px",
        borderRadius: "9999px",
        fontSize: "11px",
        fontWeight: 700,
        lineHeight: "1.8",
        whiteSpace: "nowrap",
        letterSpacing: "0.03em",
        boxSizing: "border-box",
        backgroundColor: hovered
          ? `rgba(${r},${g},${b},0.22)`
          : `rgba(${r},${g},${b},0.12)`,
        border: `1.5px solid rgba(${r},${g},${b},0.6)`,
        color: `rgb(${r},${g},${b})`,
        transform: hovered ? "scale(1.05)" : "scale(1)",
        transition: "transform 0.15s ease, background-color 0.15s ease",
        cursor: "default",
      }}
    >
      {label}
    </span>
  );
}

export default function BentoProjects({ projects }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const rgb = useAccentRgb();
  const [r, g, b] = rgb;

  const getBentoClass = (index) => {
    const patterns = [
      "md:col-span-2 md:row-span-2",
      "md:col-span-1",
      "md:col-span-1",
      "md:col-span-2",
      "md:col-span-1",
      "md:col-span-1",
    ];
    return patterns[index % patterns.length];
  };

  const isFeatured = (project) =>
    project.name === "X/O (Tic-Tac-Toe) Game" ||
    project.name === "Quiz App Application";

  const noGithub = (project) =>
    project.name === "Pharmacy Management System (Analysis + DB Design)" ||
    project.name === "Full-Stack Donation Website";

  return (
    <>
      <style>{`
        @property --sa {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes spinBorder {
          to { --sa: 360deg; }
        }
        @keyframes accentSlide {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        .bento-card {
          position: relative;
          border-radius: 1.5rem;
          border: 1px solid rgba(var(--card-border));
          background: rgb(var(--card-bg));
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 18px 60px rgba(0,0,0,0.18);
          transition: box-shadow 0.3s ease;
          overflow: hidden;
        }
        .bento-card:hover {
          box-shadow: 0 24px 80px rgba(0,0,0,0.26);
        }
        .bento-shimmer::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: 1.5rem;
          padding: 1px;
          background: conic-gradient(
            from var(--sa, 0deg),
            transparent 0deg,
            rgba(var(--accent), 0.8) 60deg,
            transparent 120deg
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          animation: spinBorder 2.4s linear infinite;
          z-index: 2;
        }
        .bento-github {
          position: absolute;
          bottom: 14px;
          right: 14px;
          z-index: 10;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          background: rgba(var(--accent), 0.12);
          border: 1px solid rgba(var(--accent), 0.28);
          color: rgb(var(--fg));
          backdrop-filter: blur(8px);
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.25s ease, transform 0.25s ease, background 0.2s ease;
          pointer-events: none;
          cursor: pointer;
        }
        .bento-shimmer .bento-github,
        .bento-wrap:hover .bento-github {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .bento-github:hover {
          background: rgba(var(--accent), 0.24) !important;
        }
        .accent-bar {
          height: 3px;
          width: 100%;
          background: linear-gradient(90deg,
            rgba(var(--accent),0.9),
            rgba(var(--accent),0.3),
            rgba(var(--accent),0.9)
          );
          background-size: 200% 100%;
          animation: accentSlide 3s ease infinite;
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
        {projects.map((project, index) => {
          const featured = isFeatured(project);
          const isHovered = hoveredIndex === index;

          return (
            <Reveal key={project.name} delay={index * 60}>
              <div
                className={`${getBentoClass(index)} bento-wrap`}
                style={{ height: "100%", position: "relative" }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <TiltCard maxTilt={featured ? 7 : 4}>
                  <div
                    className={`bento-card h-full flex flex-col ${isHovered ? "bento-shimmer" : ""}`}
                  >
                    {featured && <div className="accent-bar" />}

                    <div className="p-6 flex flex-col flex-1">
                      {/* Header */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: "12px",
                          marginBottom: "12px",
                        }}
                      >
                        <h3
                          className={`font-semibold leading-tight ${featured ? "text-2xl" : "text-lg"}`}
                          style={{ color: "rgb(var(--fg))" }}
                        >
                          {project.name}
                        </h3>
                        {featured && (
                          <span
                            style={{
                              flexShrink: 0,
                              fontSize: "11px",
                              padding: "4px 12px",
                              borderRadius: "9999px",
                              fontWeight: 600,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              backgroundColor: `rgba(${r},${g},${b},0.15)`,
                              color: `rgb(${r},${g},${b})`,
                              border: `1px solid rgba(${r},${g},${b},0.35)`,
                            }}
                          >
                            {/* Yellow star */}
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="#facc15"
                              style={{ flexShrink: 0 }}
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Tech pills — pure inline styles, no CSS classes */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                          marginBottom: "16px",
                        }}
                      >
                        {(project.tech || []).map((tech) => (
                          <TechPill key={tech} label={tech} rgb={rgb} />
                        ))}
                      </div>

                      {/* Bullet points */}
                      <ul
                        className={`list-disc pl-5 space-y-2 flex-1 ${featured ? "text-base" : "text-sm"}`}
                        style={{ color: "rgba(var(--muted))" }}
                      >
                        {(project.points || []).map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>

                      <div style={{ height: 36 }} />
                    </div>

                    {!noGithub(project) && (
                      <a
                        href="https://github.com/SanadHerzalla"
                        target="_blank"
                        rel="noreferrer"
                        className="bento-github"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                        </svg>
                        View on GitHub &rarr;
                      </a>
                    )}
                  </div>
                </TiltCard>
              </div>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
