import { useEffect, useMemo, useRef, useState } from "react";
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
  const theme = props?.theme ?? "dark";

  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("about");

  const rootRef = useRef(null);
  const itemsRef = useRef([]);

  const menuId = useMemo(
    () => `dangling-nav-menu-${Math.random().toString(16).slice(2)}`,
    []
  );

  const go = (id) => {
    setActiveId(id);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const onDown = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const idx = Math.max(
      0,
      links.findIndex((l) => l.id === activeId)
    );

    requestAnimationFrame(() => itemsRef.current[idx]?.focus?.());
  }, [open, activeId]);

  useEffect(() => {
    const els = links.map((l) => document.getElementById(l.id)).filter(Boolean);
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (!intersecting.length) return;

        const byOrder = intersecting
          .map((e) => e.target.id)
          .filter(Boolean);

        const lastVisible = byOrder[byOrder.length - 1];
        if (lastVisible) setActiveId(lastVisible);
      },
      {
        root: null,
        threshold: 0.15,
        rootMargin: "-20% 0px -55% 0px",
      }
    );

    els.forEach((el) => obs.observe(el));

    const onScroll = () => {
      const doc = document.documentElement;
      const nearBottom = doc.scrollTop + window.innerHeight >= doc.scrollHeight - 8;
      if (nearBottom) setActiveId("contact");
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const onTriggerKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((v) => !v);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const onMenuKeyDown = (e) => {
    const currentIndex = itemsRef.current.findIndex((n) => n === document.activeElement);
    const last = links.length - 1;

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = currentIndex < 0 ? 0 : Math.min(last, currentIndex + 1);
      itemsRef.current[next]?.focus?.();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = currentIndex < 0 ? last : Math.max(0, currentIndex - 1);
      itemsRef.current[prev]?.focus?.();
      return;
    }

    if (e.key === "Home") {
      e.preventDefault();
      itemsRef.current[0]?.focus?.();
      return;
    }

    if (e.key === "End") {
      e.preventDefault();
      itemsRef.current[last]?.focus?.();
      return;
    }
  };

  return (
    <div ref={rootRef} className="fixed left-0 top-6 z-50 select-none">
      <div
        className="absolute left-12 -top-6 h-6 w-px"
        style={{
          background: `rgba(var(--accent),0.38)`,
          boxShadow: `0 0 14px rgba(var(--accent),0.55)`,
        }}
      />

      <div className="group relative ml-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          onKeyDown={onTriggerKeyDown}
          className={[
            "flex items-center gap-3 rounded-r-2xl px-5 py-3",
            "backdrop-blur-xl transition-all duration-300",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
          ].join(" ")}
          style={{
            background: `rgba(var(--card-bg))`,
            border: `1px solid rgba(var(--card-border))`,
            boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
            color: `rgb(var(--fg))`,
          }}
          aria-label="Open navigation"
          aria-expanded={open}
          aria-controls={menuId}
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{
              background: `rgb(var(--accent))`,
              boxShadow: theme === "dark" ? `0 0 14px rgba(var(--accent),0.85)` : "none",
            }}
          />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold tracking-wide">{resumeData.name}</span>
            <span className="text-xs tracking-wide opacity-70">Navigation</span>
          </div>

          <span
            className="ml-2 rounded-full px-2 py-1 text-[10px] uppercase tracking-widest"
            style={{
              background: `rgba(var(--accent),0.10)`,
              color: `rgb(var(--fg))`,
              border: `1px solid rgba(var(--accent),0.18)`,
            }}
          >
            {open ? "Close" : "Menu"}
          </span>
        </button>

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
            id={menuId}
            role="menu"
            aria-label="Sections"
            tabIndex={-1}
            onKeyDown={onMenuKeyDown}
            className="mt-4 w-[300px] rounded-2xl p-4 backdrop-blur-xl"
            style={{
              background: `rgba(var(--card-bg))`,
              border: `1px solid rgba(var(--card-border))`,
              boxShadow: "0 30px 90px rgba(0,0,0,0.38)",
              color: `rgb(var(--fg))`,
            }}
          >
            <div className="flex items-center justify-between pb-3">
              <div
                className="text-xs uppercase tracking-widest"
                style={{ color: `rgba(var(--muted))` }}
              >
                Sections
              </div>

              
            </div>

            <div className="flex flex-col gap-1">
              {links.map((l, idx) => {
                const isActive = activeId === l.id;

                return (
                  <button
                    key={l.id}
                    ref={(el) => (itemsRef.current[idx] = el)}
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      go(l.id);
                      setOpen(false);
                    }}
                    className={[
                      "group/item flex items-center justify-between",
                      "rounded-xl px-3 py-2 text-sm",
                      "transition-all duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-offset-2",
                    ].join(" ")}
                    style={{
                      background: isActive ? `rgba(var(--accent),0.16)` : "transparent",
                      color: isActive ? `rgb(var(--fg))` : `rgba(var(--muted))`,
                      border: isActive ? `1px solid rgba(var(--accent),0.22)` : "1px solid transparent",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          background: isActive ? `rgb(var(--accent))` : `rgba(var(--muted))`,
                          boxShadow: isActive ? `0 0 10px rgba(var(--accent),0.75)` : "none",
                        }}
                      />
                      {l.label}
                    </span>

                    <span
                      className="text-[10px] uppercase tracking-widest opacity-0 group-hover/item:opacity-70 transition"
                      style={{ color: `rgba(var(--muted))` }}
                    >
                      {isActive ? "Active" : "Go"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 text-[11px]" style={{ color: `rgba(var(--muted))` }}>
              Tip: Use <span style={{ color: `rgb(var(--fg))` }}>↑ ↓</span>,{" "}
              <span style={{ color: `rgb(var(--fg))` }}>Enter</span>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
