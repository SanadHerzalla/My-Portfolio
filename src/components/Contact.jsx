import Section from "./Section";
import Reveal from "./Reveal";
import { resumeData } from "../data/resumeData";

export default function Contact() {
  return (
    <Section id="contact" title="Contact" subtitle="Let’s connect">
      <Reveal>
        <div className="rounded-3xl border border-black/10 bg-white/70 p-8 backdrop-blur">
          <div className="grid gap-3 text-black/80">
            <p>
              Email:{" "}
              <a className="underline" href={`mailto:${resumeData.email}`}>
                {resumeData.email}
              </a>
            </p>
            <p>Phone: {resumeData.phone}</p>
            <p>
              LinkedIn:{" "}
              <a className="underline" href={resumeData.links.linkedin} target="_blank" rel="noreferrer">
                sanadhrz
              </a>
            </p>
            <p>
              GitHub:{" "}
              <a className="underline" href={resumeData.links.github} target="_blank" rel="noreferrer">
                SanadHerzalla
              </a>
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a className="rounded-xl bg-black px-4 py-2 font-medium text-white" href={`mailto:${resumeData.email}`}>
              Email Me
            </a>
            <a className="rounded-xl border border-black/15 bg-white px-4 py-2 text-black" href={resumeData.links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
