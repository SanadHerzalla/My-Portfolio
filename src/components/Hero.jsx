import { resumeData } from "../data/resumeData";

export default function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl px-4 py-20">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
        <p className="text-sm text-zinc-400">{resumeData.location}</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
          {resumeData.name}
        </h1>
        <p className="mt-2 text-lg text-zinc-300">{resumeData.title}</p>

        <p className="mt-6 max-w-2xl text-zinc-300">{resumeData.profile}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            className="rounded-xl bg-white text-zinc-950 px-4 py-2 font-medium hover:opacity-90"
            href="#projects"
          >
            View Projects
          </a>
          <a
            className="rounded-xl border border-white/15 px-4 py-2 hover:bg-white/10"
            href={resumeData.links.github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="rounded-xl border border-white/15 px-4 py-2 hover:bg-white/10"
            href={resumeData.links.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
