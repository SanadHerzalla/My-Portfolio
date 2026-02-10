import { resumeData } from "../data/resumeData";

const items = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "awards", label: "Awards" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#top" className="font-semibold tracking-tight">
          {resumeData.name}
        </a>

        <nav className="hidden gap-6 text-sm text-zinc-300 md:flex">
          {items.map((it) => (
            <a key={it.id} href={`#${it.id}`} className="hover:text-white">
              {it.label}
            </a>
          ))}
        </nav>

        <a
          className="rounded-xl border border-white/15 px-3 py-1.5 text-sm hover:bg-white/10"
          href={`mailto:${resumeData.email}`}
        >
          Email
        </a>
      </div>
    </header>
  );
}
