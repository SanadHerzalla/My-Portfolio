import Section from "./Section";
import Reveal from "./Reveal";
import { resumeData } from "../data/resumeData";

export default function About() {
  return (
    <Section id="about" title="About" subtitle="A quick summary">
      <Reveal>
        <div className="rounded-3xl border border-black/10 bg-white/70 p-8 backdrop-blur">
          <p className="text-black/80 leading-relaxed">{resumeData.description}</p>
        </div>
      </Reveal>
    </Section>
  );
}
