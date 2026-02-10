import Section from "./Section";
import Reveal from "./Reveal";
import { resumeData } from "../data/resumeData";

export default function Projects() {
  return (
    <Section id="projects" title="Projects" subtitle="Things I’ve built">
      <div className="grid gap-6 md:grid-cols-2">
        {resumeData.projects.map((p) => (
          <Reveal key={p.name}>
            <div className="h-full rounded-3xl border border-black/10 bg-white/70 p-6 backdrop-blur">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-black">{p.name}</h3>
                <div className="flex flex-wrap gap-2 justify-end">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-black/15 bg-white px-3 py-1 text-xs text-black"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <ul className="mt-4 list-disc pl-5 text-black/80 space-y-2">
                {p.points.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
