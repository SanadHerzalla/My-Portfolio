import Section from "./Section";
import { resumeData } from "../data/resumeData";

export default function Awards() {
  return (
    <Section id="awards" title="Awards" subtitle="Highlights from competitions and achievements">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <ul className="list-disc space-y-2 pl-5 text-zinc-300">
          {resumeData.awards.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
