import SkillsOrbit from "./components/SkillsOrbit";
import { resumeData } from "./data/resumeData";

export default function SkillsSection() {
  // You can also group them: Frontend / Backend / Databases...
  const frontEnd = ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind"];

  return (
    <section id="skills" className="py-16">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <p className="mt-2 text-black/60">Scroll to rotate the orbit</p>

        <div className="mt-10">
          <SkillsOrbit title="FRONT END" items={frontEnd} />
        </div>
      </div>
    </section>
  );
}
