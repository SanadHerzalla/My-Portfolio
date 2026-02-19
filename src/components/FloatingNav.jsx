import { useEffect, useMemo, useRef, useState } from "react";
import { resumeData } from "../data/resumeData";

const links = [
  { id: "about", label: "About", icon: "👤" },
  { id: "skills", label: "Skills", icon: "⚡" },
  { id: "projects", label: "Projects", icon: "🚀" },
  { id: "certifications", label: "Certs", icon: "🏆" },
  { id: "education", label: "Education", icon: "🎓" },
  { id: "contact", label: "Contact", icon: "✉️" },
];

export default function FloatingNav({ showNav = true }) {
  const [activeId, setActiveId] = useState("about");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const indicatorRef = useRef(null);
  const navRef = useRef(null);
  const btnRefs = useRef([]);

  /* ── scroll-spy ── */
  useEffect(() => {
    const els = links.map((l) => document.getElementById(l.id)).filter(Boolean);

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const last = visible[visible.length - 1].target.id;
        if (last) setActiveId(last);
      },
      { threshold: 0.15, rootMargin: "-20% 0px -55% 0px" },
    );

    els.forEach((el) => io.observe(el));

    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const doc = document.documentElement;
      if (doc.scrollTop + window.innerHeight >= doc.scrollHeight - 8)
        setActiveId("contact");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* ── sliding indicator position ── */
  useEffect(() => {
    const idx = links.findIndex((l) => l.id === activeId);
    const btn = btnRefs.current[idx];
    const nav = navRef.current;
    const ind = indicatorRef.current;
    if (!btn || !nav || !ind) return;

    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    ind.style.left = `${btnRect.left - navRect.left}px`;
    ind.style.width = `${btnRect.width}px`;
  }, [activeId, showNav]);

  /* ── close mobile on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target))
        setMobileOpen(false);
    };
    window.addEventListener("pointerdown", handler);
    return () => window.removeEventListener("pointerdown", handler);
  }, []);

  const scrollTo = (id) => {
    setActiveId(id);
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    el.style.scrollMarginTop = "96px";
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      el.style.scrollMarginTop = "";
    }, 700);
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════
          DESKTOP — floating island
      ═══════════════════════════════════════════════ */}
      <nav
        ref={navRef}
        aria-label="Main navigation"
        className="fixed top-5 left-1/2 z-50 hidden md:flex items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-500"
        style={{
          transform: `translateX(-50%) translateY(${showNav ? "0" : "-110%"})`,
          opacity: showNav ? 1 : 0,
          background: scrolled
            ? "rgba(var(--card-bg), 0.88)"
            : "rgba(var(--card-bg), 0.72)",
          border: "1px solid rgba(var(--card-border))",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: scrolled
            ? "0 20px 60px rgba(0,0,0,0.28), 0 0 0 1px rgba(var(--accent),0.08)"
            : "0 12px 40px rgba(0,0,0,0.16)",
          willChange: "transform, opacity",
        }}
      >
        {/* Brand chip */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl mr-2 shrink-0"
          style={{
            background: "rgba(var(--accent), 0.10)",
            border: "1px solid rgba(var(--accent), 0.18)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: "rgb(var(--accent))",
              boxShadow: "0 0 8px rgba(var(--accent), 0.7)",
            }}
          />
          <span
            className="text-xs font-semibold tracking-wide"
            style={{ color: "rgb(var(--fg))" }}
          >
            {resumeData.name.split(" ")[0]}
          </span>
        </div>

        {/* Divider */}
        <div
          className="w-px h-5 mx-1 shrink-0"
          style={{ background: "rgba(var(--card-border))" }}
        />

        {/* Sliding indicator (background) */}
        <div className="relative flex items-center gap-0.5">
          <div
            ref={indicatorRef}
            className="absolute h-full rounded-xl transition-all duration-300 ease-out pointer-events-none"
            style={{
              background: "rgba(var(--accent), 0.12)",
              border: "1px solid rgba(var(--accent), 0.22)",
              top: 0,
              zIndex: 0,
            }}
          />

          {links.map((l, i) => {
            const isActive = activeId === l.id;
            const isHov = hovered === l.id;
            return (
              <button
                key={l.id}
                ref={(el) => (btnRefs.current[i] = el)}
                onClick={() => scrollTo(l.id)}
                onMouseEnter={() => setHovered(l.id)}
                onMouseLeave={() => setHovered(null)}
                className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2"
                style={{
                  color: isActive
                    ? "rgb(var(--fg))"
                    : isHov
                      ? "rgb(var(--fg))"
                      : "rgba(var(--muted))",
                  transform: isActive ? "scale(1.02)" : "scale(1)",
                  whiteSpace: "nowrap",
                }}
                aria-current={isActive ? "page" : undefined}
              >
                <span style={{ fontSize: 13 }}>{l.icon}</span>
                <span>{l.label}</span>
                {isActive && (
                  <span
                    className="absolute -bottom-0.5 left-1/2 w-1 h-1 rounded-full"
                    style={{
                      background: "rgb(var(--accent))",
                      transform: "translateX(-50%)",
                      boxShadow: "0 0 6px rgba(var(--accent),0.8)",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════
          MOBILE — bottom sheet style
      ═══════════════════════════════════════════════ */}
      <div
        className="fixed bottom-5 left-1/2 z-50 flex md:hidden"
        style={{ transform: "translateX(-50%)" }}
      >
        {/* Pill toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 active:scale-95"
          style={{
            background: "rgba(var(--card-bg), 0.92)",
            border: "1px solid rgba(var(--card-border))",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 16px 50px rgba(0,0,0,0.28)",
            color: "rgb(var(--fg))",
          }}
          aria-label="Open navigation"
          aria-expanded={mobileOpen}
        >
          <span
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: "rgb(var(--accent))",
              boxShadow: mobileOpen
                ? "0 0 12px rgba(var(--accent),0.9)"
                : "none",
            }}
          />
          <span>
            {links.find((l) => l.id === activeId)?.label ?? "Navigate"}
          </span>
          <span
            className="text-xs transition-transform duration-300"
            style={{
              color: "rgba(var(--muted))",
              transform: mobileOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▲
          </span>
        </button>

        {/* Mobile menu drawer */}
        <div
          className="absolute bottom-full mb-3 left-1/2 w-56 rounded-2xl p-2 transition-all duration-300"
          style={{
            transform: `translateX(-50%) translateY(${mobileOpen ? "0" : "10px"})`,
            opacity: mobileOpen ? 1 : 0,
            pointerEvents: mobileOpen ? "auto" : "none",
            background: "rgba(var(--card-bg), 0.96)",
            border: "1px solid rgba(var(--card-border))",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
          }}
        >
          {links.map((l) => {
            const isActive = activeId === l.id;
            return (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-98 text-left"
                style={{
                  background: isActive
                    ? "rgba(var(--accent),0.14)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(var(--accent),0.22)"
                    : "1px solid transparent",
                  color: isActive ? "rgb(var(--fg))" : "rgba(var(--muted))",
                }}
              >
                <span>{l.icon}</span>
                <span>{l.label}</span>
                {isActive && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "rgb(var(--accent))",
                      boxShadow: "0 0 8px rgba(var(--accent),0.8)",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
