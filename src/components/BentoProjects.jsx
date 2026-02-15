import { useState } from "react";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import GlassMorphCard from "./GlassMorphCard";

/**
 * BentoProjects - Modern bento grid layout with asymmetric cards
 * 2026 UI trend - inspired by Apple and modern design systems
 */
export default function BentoProjects({ projects }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Bento grid pattern: featured projects get larger cards
  const getBentoClass = (index) => {
    const patterns = [
      "md:col-span-2 md:row-span-2", // Large featured
      "md:col-span-1", // Regular
      "md:col-span-1", // Regular
      "md:col-span-2", // Wide
      "md:col-span-1", // Regular
      "md:col-span-1", // Regular
    ];
    return patterns[index % patterns.length];
  };

  // Check if project is featured based on name
  const isFeatured = (project) => {
    return (
      project.name === "X/O (Tic-Tac-Toe) Game" ||
      project.name === "Quiz App Application"
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
      {projects.map((project, index) => {
        const featured = isFeatured(project);

        return (
          <Reveal key={project.name}>
            <div
              className={getBentoClass(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <TiltCard maxTilt={featured ? 8 : 5}>
                <GlassMorphCard
                  className={`h-full p-6 flex flex-col transition-all duration-300 ${
                    hoveredIndex === index ? "scale-[1.02]" : ""
                  }`}
                  intensity={featured ? "high" : "medium"}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3
                      className={`font-semibold ${featured ? "text-2xl" : "text-lg"}`}
                      style={{ color: `rgb(var(--fg))` }}
                    >
                      {project.name}
                    </h3>

                    {featured && (
                      <span
                        className="text-xs px-3 py-1 rounded-full backdrop-blur-sm shrink-0"
                        style={{
                          background: `rgba(var(--accent), 0.2)`,
                          color: `rgb(var(--accent))`,
                          border: `1px solid rgba(var(--accent), 0.3)`,
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {(project.tech || []).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-3 py-1 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105"
                        style={{
                          background: `rgba(var(--card-bg))`,
                          border: `1px solid rgba(var(--card-border))`,
                          color: `rgb(var(--fg))`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <ul
                    className={`list-disc pl-5 space-y-2 flex-1 ${featured ? "text-base" : "text-sm"}`}
                    style={{ color: `rgba(var(--muted))` }}
                  >
                    {(project.points || []).map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </GlassMorphCard>
              </TiltCard>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
