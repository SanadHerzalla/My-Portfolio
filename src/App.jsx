import { useEffect, useState, useRef } from "react";
import useTheme from "./hooks/useTheme";
import AuroraBackground from "./components/AuroraBackground";
import Container from "./components/Container";
import { resumeData } from "./data/resumeData";
import Reveal from "./components/Reveal";
import { Mail, Linkedin, Github, ArrowUp, Sun, Moon } from "lucide-react";
import Loader from "./components/Loader";
import SkillRadar from "./components/SkillRadar";
import FloatingNav from "./components/FloatingNav";
import Typewriter from "./components/Typewriter";
import MagneticButton from "./components/MagneticButton";
import BentoProjects from "./components/BentoProjects";
import GlassMorphCard from "./components/GlassMorphCard";
import TiltCard from "./components/TiltCard";

/* â”€â”€ Cursor glow trail â”€â”€ */
function CursorGlow() {
  const glowRef = useRef(null);
  const pos = useRef({ x: -400, y: -400 });
  const cur = useRef({ x: -400, y: -400 });
  const rafRef = useRef(0);

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const tick = () => {
      cur.current.x += (pos.current.x - cur.current.x) * 0.11;
      cur.current.y += (pos.current.y - cur.current.y) * 0.11;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${cur.current.x}px, ${cur.current.y}px) translate(-50%, -50%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1,
        pointerEvents: "none",
        width: 420,
        height: 420,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(var(--accent),0.07) 0%, transparent 70%)",
        willChange: "transform",
      }}
    />
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [skipVisible, setSkipVisible] = useState(false);
  const { theme, toggle } = useTheme();
  const [showTop, setShowTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          setShowTop(y > 700);
          const h =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
          setScrollProgress((document.documentElement.scrollTop / h) * 100);
          // Nav is always visible on desktop
          setShowNav(true);
          setLastScrollY(y);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  if (!resumeData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: "rgb(var(--fg))" }}>resumeData is missing.</p>
      </div>
    );

  if (loading)
    return (
      <div style={{ position: "relative" }}>
        <Loader />
        <button
          onClick={() => setLoading(false)}
          style={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 10000,
            opacity: skipVisible ? 1 : 0,
            transform: skipVisible ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 400ms ease, transform 400ms ease",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.75)",
            borderRadius: 12,
            padding: "8px 20px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            backdropFilter: "blur(12px)",
            letterSpacing: "0.05em",
          }}
        >
          Skip â†’
        </button>
      </div>
    );

  const skillCategories = [
    {
      title: "Front End",
      items: [
        "React",
        "JavaScript",
        "TypeScript",
        "HTML",
        "CSS",
        "Tailwind CSS",
      ],
    },
    {
      title: "Back End",
      items: ["Java", "Spring Boot", "Node.js", "NestJS", "REST APIs", "OOP"],
    },
    {
      title: "Databases",
      items: [
        "MySQL",
        "MS SQL Server",
        "Normalization",
        "Indexes",
        "Joins",
        "Advanced Queries",
      ],
    },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.scrollMarginTop = "96px";
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      el.style.scrollMarginTop = "";
    }, 700);
  };

  return (
    <div className="relative min-h-screen" style={{ color: "rgb(var(--fg))" }}>
      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 h-[3px] z-[60] transition-all duration-300"
        style={{
          width: `${scrollProgress}%`,
          background: `linear-gradient(90deg, rgb(var(--accent)), rgba(var(--accent),0.5))`,
          boxShadow: `0 0 12px rgba(var(--accent),0.6)`,
        }}
      />

      <AuroraBackground interactive />
      <CursorGlow />

      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="fixed right-6 top-6 z-50 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2.5"
        style={{
          background: `rgba(var(--card-bg))`,
          border: `1px solid rgba(var(--card-border))`,
          color: `rgb(var(--fg))`,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <>
            <Sun size={18} />
            <span>Light</span>
          </>
        ) : (
          <>
            <Moon size={18} />
            <span>Dark</span>
          </>
        )}
      </button>

      <FloatingNav showNav={showNav} />

      {/* Scroll to top */}
      <div
        className="fixed bottom-6 right-6 z-50 transition-all duration-300"
        style={{
          opacity: showTop ? 1 : 0,
          transform: showTop ? "translateY(0)" : "translateY(20px)",
          pointerEvents: showTop ? "auto" : "none",
        }}
      >
        <MagneticButton strength={0.4}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rounded-full p-3 transition-all duration-300 hover:scale-110 active:scale-95 group"
            style={{
              background: `rgba(var(--card-bg))`,
              border: `1px solid rgba(var(--card-border))`,
              color: `rgb(var(--fg))`,
              boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
            aria-label="Scroll to top"
          >
            <ArrowUp
              size={20}
              className="group-hover:-translate-y-0.5 transition-transform"
            />
          </button>
        </MagneticButton>
      </div>

      <div className="relative z-10">
        <main>
          {/* â”€â”€ HERO â”€â”€ */}
          <section className="py-16 relative overflow-hidden">
            <Container>
              <GlassMorphCard className="p-10 text-center" intensity="high">
                <p
                  className="text-sm tracking-wider uppercase"
                  style={{ color: `rgba(var(--muted))` }}
                >
                  {resumeData.title}
                </p>

                {/*
                  âœ… FIX: h1 must NOT have text-transparent / bg-clip-text here.
                  Typewriter applies its own gradient internally.
                  Just give it size + weight.
                */}
                <h1 className="mt-3 text-4xl md:text-6xl font-bold">
                  <Typewriter
                    words={[
                      "Sanad Herzalla",
                      "Software Engineer",
                      "Full-Stack Dev",
                      "Problem Solver",
                    ]}
                    interval={2600}
                  />
                </h1>

                <p
                  className="mt-4 text-lg md:text-xl"
                  style={{ color: `rgba(var(--muted))` }}
                >
                  Welcome to my website
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <MagneticButton strength={0.2}>
                    <button
                      type="button"
                      onClick={() => scrollTo("projects")}
                      className="group relative rounded-xl px-6 py-3 font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] overflow-hidden"
                      style={{
                        background: `rgb(var(--accent))`,
                        color: "#ffffff",
                        boxShadow: `0 10px 40px rgba(var(--accent),0.3)`,
                      }}
                    >
                      <span className="relative z-10">View Projects</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                  </MagneticButton>

                  <MagneticButton strength={0.2}>
                    <button
                      type="button"
                      onClick={() => scrollTo("contact")}
                      className="rounded-xl border px-6 py-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
                      style={{
                        background: `rgba(var(--card-bg))`,
                        borderColor: `rgba(var(--card-border))`,
                        color: `rgb(var(--fg))`,
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      Contact
                    </button>
                  </MagneticButton>
                </div>
              </GlassMorphCard>
            </Container>
          </section>

          {/* â”€â”€ ABOUT â”€â”€ */}
          <section id="about" className="py-16">
            <Container>
              <Reveal>
                <TiltCard>
                  <GlassMorphCard className="p-8" intensity="medium">
                    <h2 className="text-2xl font-semibold text-left bg-gradient-to-r from-[rgb(var(--fg))] to-[rgba(var(--accent),1)] bg-clip-text text-transparent">
                      About
                    </h2>
                    <p
                      className="mt-4 leading-relaxed text-left"
                      style={{ color: `rgba(var(--muted))` }}
                    >
                      {resumeData.description}
                    </p>
                  </GlassMorphCard>
                </TiltCard>
              </Reveal>
            </Container>
          </section>

          {/* â”€â”€ SKILLS â”€â”€ */}
          <section
            id="skills"
            className="relative min-h-screen flex items-center justify-center py-20"
          >
            <Container>
              <Reveal>
                <div className="mb-10 text-center">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-[rgb(var(--fg))] to-[rgba(var(--accent),1)] bg-clip-text text-transparent">
                    Skills
                  </h2>
                  <p className="mt-2" style={{ color: `rgba(var(--muted))` }}>
                    Scroll/drag to rotate. Explore all skills to unlock the next
                    category.
                  </p>
                </div>
                <SkillRadar categories={skillCategories} size={720} />
              </Reveal>
            </Container>
          </section>

          {/* â”€â”€ PROJECTS â”€â”€ */}
          <section id="projects" className="py-16">
            <Container>
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[rgb(var(--fg))] to-[rgba(var(--accent),1)] bg-clip-text text-transparent">
                  Projects
                </h2>
                <p className="mt-2" style={{ color: `rgba(var(--muted))` }}>
                  Selected work
                </p>
              </div>
              <BentoProjects projects={resumeData.projects || []} />
            </Container>
          </section>

          {/* â”€â”€ CERTIFICATIONS â”€â”€ */}
          <section id="certifications" className="py-16">
            <Container>
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[rgb(var(--fg))] to-[rgba(var(--accent),1)] bg-clip-text text-transparent">
                  Certifications
                </h2>
                <p className="mt-2" style={{ color: `rgba(var(--muted))` }}>
                  Achievements & credentials
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {(resumeData.certifications || []).map((c, idx) => (
                  <Reveal key={c.name}>
                    <TiltCard>
                      <GlassMorphCard
                        className="p-6"
                        intensity="medium"
                        style={{
                          animation: `certIn 520ms ease ${idx * 120}ms both`,
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3
                              className="text-lg font-semibold"
                              style={{ color: `rgb(var(--fg))` }}
                            >
                              {c.name}
                            </h3>
                            <p
                              className="mt-1 text-sm"
                              style={{ color: `rgba(var(--muted))` }}
                            >
                              {c.issuer}
                            </p>
                          </div>
                          <span
                            className="rounded-full border px-3 py-1 text-xs whitespace-nowrap"
                            style={{
                              background: `rgba(var(--accent),0.1)`,
                              borderColor: `rgba(var(--accent),0.3)`,
                              color: `rgb(var(--fg))`,
                            }}
                          >
                            {c.date}
                          </span>
                        </div>
                        {c.note && (
                          <p
                            className="mt-4 leading-relaxed"
                            style={{ color: `rgba(var(--muted))` }}
                          >
                            {c.note}
                          </p>
                        )}
                      </GlassMorphCard>
                    </TiltCard>
                  </Reveal>
                ))}
              </div>
              <style>{`@keyframes certIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }`}</style>
            </Container>
          </section>

          {/* â”€â”€ EDUCATION â”€â”€ */}
          <section id="education" className="py-16">
            <Container>
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[rgb(var(--fg))] to-[rgba(var(--accent),1)] bg-clip-text text-transparent">
                  Education
                </h2>
                <p className="mt-2" style={{ color: `rgba(var(--muted))` }}>
                  Academic background
                </p>
              </div>
              {(resumeData.education || []).map((e) => (
                <Reveal key={e.school}>
                  <TiltCard>
                    <GlassMorphCard className="p-6 mb-6" intensity="medium">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3
                          className="text-lg font-semibold"
                          style={{ color: `rgb(var(--fg))` }}
                        >
                          {e.school}
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: `rgba(var(--muted))` }}
                        >
                          {e.period}
                        </p>
                      </div>
                      <p
                        className="mt-2"
                        style={{ color: `rgba(var(--muted))` }}
                      >
                        {e.degree}
                      </p>
                      <p
                        className="mt-1"
                        style={{ color: `rgba(var(--muted))` }}
                      >
                        {e.note}
                      </p>
                    </GlassMorphCard>
                  </TiltCard>
                </Reveal>
              ))}
            </Container>
          </section>

          {/* â”€â”€ CONTACT â”€â”€ */}
          <section id="contact" className="py-16">
            <Container>
              <Reveal>
                <GlassMorphCard className="p-10 text-center" intensity="high">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-[rgb(var(--fg))] to-[rgba(var(--accent),1)] bg-clip-text text-transparent">
                    Contact
                  </h2>
                  <p className="mt-3" style={{ color: `rgba(var(--muted))` }}>
                    Email:{" "}
                    <a
                      className="underline hover:text-[rgb(var(--accent))] transition-colors"
                      style={{ color: `rgb(var(--fg))` }}
                      href={`mailto:${resumeData.email}`}
                    >
                      {resumeData.email}
                    </a>
                  </p>
                  <p className="mt-1" style={{ color: `rgba(var(--muted))` }}>
                    Phone: {resumeData.phone}
                  </p>

                  <div className="mt-6 flex justify-center gap-4">
                    {[
                      {
                        href: `mailto:${resumeData.email}`,
                        icon: <Mail size={20} />,
                        label: "Email",
                      },
                      {
                        href: resumeData.links.linkedin,
                        icon: <Linkedin size={20} />,
                        label: "LinkedIn",
                        ext: true,
                      },
                      {
                        href: resumeData.links.github,
                        icon: <Github size={20} />,
                        label: "GitHub",
                        ext: true,
                      },
                    ].map(({ href, icon, label, ext }) => (
                      <MagneticButton key={label} strength={0.3}>
                        <a
                          href={href}
                          aria-label={label}
                          target={ext ? "_blank" : undefined}
                          rel={ext ? "noreferrer" : undefined}
                          className="group transition-all duration-300 hover:scale-110 active:scale-95"
                          style={{
                            /* fixed 48Ã—48 circle, true flex centering */
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            background: "rgb(var(--card-bg))",
                            border: "1px solid rgba(var(--card-border))",
                            color: "rgb(var(--fg))",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                            backdropFilter: "blur(14px)",
                            WebkitBackdropFilter: "blur(14px)",
                            flexShrink: 0,
                          }}
                        >
                          <span
                            className="group-hover:rotate-12 transition-transform"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {icon}
                          </span>
                        </a>
                      </MagneticButton>
                    ))}
                  </div>
                </GlassMorphCard>
              </Reveal>
            </Container>
          </section>

          <footer
            className="py-10 text-center text-sm"
            style={{ color: `rgba(var(--muted))` }}
          >
            © {new Date().getFullYear()} {resumeData.name}
          </footer>
        </main>
      </div>
    </div>
  );
}
