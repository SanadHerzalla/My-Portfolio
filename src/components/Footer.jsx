import { resumeData } from "../data/resumeData";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto max-w-6xl px-4 text-sm text-zinc-400">
        <p>© {new Date().getFullYear()} {resumeData.name}. Built with React.</p>
      </div>
    </footer>
  );
}
