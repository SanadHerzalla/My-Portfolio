import { useEffect, useRef, useState } from "react";
import { resumeData } from "../data/resumeData";

const links = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export default function DanglingNav(props) {
  // Safe fallbacks
  const theme = props?.theme ?? "dark";
  const toggleTheme = props?.toggleTheme ?? (() => {});

  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // ✅ close when tapping outside (mobile)
  useEffect(() => {
    const onDown = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  return (
    <div ref={rootRef} className="fixed left-0 top-6 z-50">
      {/* hanging line */}
      <div
        className="absolute left-12 -top-6 h-6 w-px"
        style={{
          background: `rgba(var(--accent),0.4)`,
          boxShadow: `0 0 10px rgba(var(--accent),0.5)`,
        }}
      />

      <div className="group relative ml-3">
        {/* main dangling bar */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)} // ✅ tap toggle
          className="flex items-center gap-3 rounded-r-2xl px-6 py-3 backdrop-blur-xl transition-all duration-300"
          style={{
            background: `rgba(var(--card-bg))`,
            border: `1px solid rgba(var(--card-border))`,
            boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
            color: `rgb(var(--fg))`,
          }}
          aria-label="Open navigation"
          aria-expanded={open}
        >
          <span
            className="h-2.5 w-2.5 rounded-full transition-all duration-300"
            style={{
              background: `rgb(var(--accent))`,
              boxShadow:
                theme === "dark" ? `0 0 12px rgba(var(--accent),0.8)` : "none",
            }}
          />
          <span className="font-semibold tracking-wide">{resumeData.name}</span>
        </button>

        {/* ✅ menu (tap on mobile, hover on desktop) */}
        <div
          className={[
            "transition-all duration-300",
            open
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-2 pointer-events-none",
            "md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:pointer-events-auto",
          ].join(" ")}
        >
          <div
            className="mt-4 w-[280px] rounded-2xl px-4 py-4 backdrop-blur-xl"
            style={{
              background: `rgba(var(--card-bg))`,
              border: `1px solid rgba(var(--card-border))`,
              boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
              color: `rgb(var(--fg))`,
            }}
          >
            <div
              className="text-xs uppercase tracking-widest px-2 pb-3"
              style={{ color: `rgba(var(--muted))` }}
            >
              Sections
            </div>

            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <button
                  type="button"
                  key={l.id}
                  onClick={() => {
                    go(l.id);
                    setOpen(false); 
                  }}
                  className="text-left rounded-xl px-3 py-2 text-sm transition-all duration-200"
                  style={{ color: `rgba(var(--muted))` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `rgba(var(--accent),0.15)`;
                    e.currentTarget.style.color = `rgb(var(--fg))`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = `rgba(var(--muted))`;
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
