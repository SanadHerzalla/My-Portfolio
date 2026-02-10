import Section from "./Section";
import Reveal from "./Reveal";
import { resumeData } from "../data/resumeData";

export default function Education() {
  return (
    <Section id="education" title="Education" subtitle="Academic background">
      <div className="grid gap-6">
        {resumeData.education.map((e) => (
          <Reveal key={e.school}>
            <div className="rounded-3xl border border-black/10 bg-white/70 p-6 backdrop-blur">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-black">{e.school}</h3>
                <p className="text-sm text-black/60">{e.period}</p>
              </div>
              <p className="mt-2 text-black/80">{e.degree}</p>
              <p className="mt-1 text-black/60">{e.note}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
