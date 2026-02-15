import { useEffect, useState } from "react";
import useTheme from "./hooks/useTheme";
import DotsBackground from "./components/DotsBackground";
import Container from "./components/Container";
import { resumeData } from "./data/resumeData";
import Reveal from "./components/Reveal";
import { Mail, Linkedin, Github, ArrowUp, Sun, Moon } from "lucide-react";

import Loader from "./components/Loader";
import SkillRadar from "./components/SkillRadar";
import DanglingNav from "./components/DanglingNav";
import Typewriter from "./components/Typewriter";

export default function App() {
  const [loading, setLoading] = useState(true);
  const { theme, toggle } = useTheme();

  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!resumeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: "rgb(var(--fg))" }}>resumeData is missing.</p>
      </div>
    );
  }

  if (loading) return <Loader />;

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

  const cardBase =
    "rounded-3xl backdrop-blur-xl border shadow-[0_18px_60px_rgba(0,0,0,0.22)]";
  const card = `${cardBase} p-10 text-center`;
  const cardLeft = `${cardBase} p-8`;
  const cardBox = `${cardBase} p-6`;

  const cardStyle = {
    background: `rgba(var(--card-bg))`,
    borderColor: `rgba(var(--card-border))`,
    color: `rgb(var(--fg))`,
  };

  const mutedStyle = { color: `rgba(var(--muted))` };

  const chipStyle = {
    background: `rgba(var(--card-bg))`,
    borderColor: `rgba(var(--card-border))`,
    color: `rgb(var(--fg))`,
  };

  const primaryBtnStyle = {
    background: `rgb(var(--accent))`,
    color: "#ffffff",
  };

  const ghostBtnStyle = {
    background: `rgba(var(--card-bg))`,
    borderColor: `rgba(var(--card-border))`,
    color: `rgb(var(--fg))`,
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const prev = el.style.scrollMarginTop;
    el.style.scrollMarginTop = "96px";

    el.scrollIntoView({ behavior: "smooth", block: "start" });

    // restore (keeps layout clean)
    setTimeout(() => {
      el.style.scrollMarginTop = prev;
    }, 700);
  };

  return (
    <div className="relative min-h-screen" style={{ color: "rgb(var(--fg))" }}>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <DotsBackground dotCount={420} />
      </div>

      <button
        onClick={toggle}
        className="fixed right-6 top-6 z-[60] rounded-full px-4 py-2.5 text-sm font-semibold transition shadow-lg hover:scale-[1.03] active:scale-[0.99] flex items-center gap-2"
        style={{
          background: `rgba(var(--card-bg))`,
          border: `1px solid rgba(var(--card-border))`,
          color: `rgb(var(--fg))`,
          backdropFilter: "blur(14px)",
        }}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <>
            <Sun size={16} />
            <span>Light</span>
          </>
        ) : (
          <>
            <Moon size={16} />
            <span>Dark</span>
          </>
        )}
      </button>

      <DanglingNav theme={theme} toggleTheme={toggle} />

      {showTop ? (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-[60] rounded-full p-3 transition hover:scale-110 active:scale-95"
          style={{
            ...ghostBtnStyle,
            boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
          }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} />
        </button>
      ) : null}

      <div className="relative z-20">
        <main>
          <section className="py-16">
            <Container>
              <div className={card} style={cardStyle}>
                <p className="text-sm" style={mutedStyle}>
                  {resumeData.title}
                </p>

                <h1 className="mt-3 text-4xl md:text-5xl font-semibold">
                  <Typewriter
                    text="Sanad Herzalla"
                    speed={55}
                    startDelay={250}
                  />
                </h1>

                <p className="mt-3 text-lg" style={mutedStyle}>
                  Welcome to my website
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => scrollTo("projects")}
                    className="rounded-xl px-5 py-2.5 font-medium transition hover:opacity-95 hover:scale-[1.02] active:scale-[0.99]"
                    style={primaryBtnStyle}
                  >
                    View Projects
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollTo("contact")}
                    className="rounded-xl border px-5 py-2.5 transition hover:opacity-95 hover:scale-[1.02] active:scale-[0.99]"
                    style={ghostBtnStyle}
                  >
                    Contact
                  </button>
                </div>
              </div>
            </Container>
          </section>

          {/* About */}
          <section id="about" className="py-16">
            <Container>
              <Reveal>
                <div className={cardLeft} style={cardStyle}>
                  <h2 className="text-2xl font-semibold text-left">About</h2>
                  <p
                    className="mt-4 leading-relaxed text-left"
                    style={mutedStyle}
                  >
                    {resumeData.description}
                  </p>
                </div>
              </Reveal>
            </Container>
          </section>

          {/* Skills */}
          <section
            id="skills"
            className="relative min-h-screen flex items-center justify-center py-20"
          >
            <Container>
              <Reveal>
                <div className="mb-10 text-center">
                  <h2 className="text-2xl font-semibold">Skills</h2>
                  <p className="mt-2" style={mutedStyle}>
                    Scroll/drag to rotate. Explore all skills to unlock the next
                    category.
                  </p>
                </div>

                <SkillRadar categories={skillCategories} size={720} />
              </Reveal>
            </Container>
          </section>

          {/* Projects */}
          <section id="projects" className="py-16">
            <Container>
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-semibold">Projects</h2>
                <p className="mt-2" style={mutedStyle}>
                  Selected work
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 auto-rows-fr">
                {(resumeData.projects || []).map((p) => (
                  <Reveal key={p.name}>
                    <div
                      className={`${cardBox} h-full flex flex-col`}
                      style={cardStyle}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold">{p.name}</h3>

                        <div className="flex flex-wrap gap-2 justify-center md:justify-end items-center">
                          {(p.tech || []).map((t) => (
                            <span
                              key={t}
                              className="rounded-full border px-3 py-1 text-xs text-center whitespace-nowrap"
                              style={chipStyle}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <ul
                        className="mt-4 list-disc pl-5 space-y-2 flex-1"
                        style={mutedStyle}
                      >
                        {(p.points || []).map((x, i) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Container>
          </section>

          {/* Certifications */}
          <section id="certifications" className="py-16">
            <Container>
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-semibold">Certifications</h2>
                <p className="mt-2" style={mutedStyle}>
                  Achievements & credentials
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {(resumeData.certifications || []).map((c, idx) => (
                  <Reveal key={c.name}>
                    <div
                      className={cardBox}
                      style={{
                        ...cardStyle,
                        animation: `certIn 520ms ease ${idx * 120}ms both`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold">{c.name}</h3>
                          <p className="mt-1 text-sm" style={mutedStyle}>
                            {c.issuer}
                          </p>
                        </div>

                        <span
                          className="rounded-full border px-3 py-1 text-xs text-center whitespace-nowrap"
                          style={chipStyle}
                        >
                          {c.date}
                        </span>
                      </div>

                      {c.note ? (
                        <p className="mt-4 leading-relaxed" style={mutedStyle}>
                          {c.note}
                        </p>
                      ) : null}
                    </div>
                  </Reveal>
                ))}
              </div>

              <style>{`
                @keyframes certIn {
                  from { opacity: 0; transform: translateY(14px); }
                  to   { opacity: 1; transform: translateY(0px); }
                }
              `}</style>
            </Container>
          </section>

          <section id="education" className="py-16">
            <Container>
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-semibold">Education</h2>
                <p className="mt-2" style={mutedStyle}>
                  Academic background
                </p>
              </div>

              {(resumeData.education || []).map((e) => (
                <Reveal key={e.school}>
                  <div className={cardBox} style={cardStyle}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-lg font-semibold">{e.school}</h3>
                      <p className="text-sm" style={mutedStyle}>
                        {e.period}
                      </p>
                    </div>
                    <p className="mt-2" style={mutedStyle}>
                      {e.degree}
                    </p>
                    <p className="mt-1" style={mutedStyle}>
                      {e.note}
                    </p>
                  </div>
                </Reveal>
              ))}
            </Container>
          </section>

          {/* Contact */}
          <section id="contact" className="py-16">
            <Container>
              <Reveal>
                <div className={card} style={cardStyle}>
                  <h2 className="text-2xl font-semibold">Contact</h2>

                  <p className="mt-3" style={mutedStyle}>
                    Email:{" "}
                    <a
                      className="underline"
                      style={{ color: `rgb(var(--fg))` }}
                      href={`mailto:${resumeData.email}`}
                    >
                      {resumeData.email}
                    </a>
                  </p>
                  <p className="mt-1" style={mutedStyle}>
                    Phone: {resumeData.phone}
                  </p>

                  <div className="mt-5 flex justify-center gap-4">
                    <a
                      href={`mailto:${resumeData.email}`}
                      aria-label="Email"
                      className="rounded-full p-3 transition hover:scale-110 active:scale-95"
                      style={{
                        ...ghostBtnStyle,
                        boxShadow: "0 14px 45px rgba(0,0,0,0.22)",
                      }}
                    >
                      <Mail size={20} />
                    </a>

                    <a
                      href={resumeData.links.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      className="rounded-full p-3 transition hover:scale-110 active:scale-95"
                      style={{
                        ...ghostBtnStyle,
                        boxShadow: "0 14px 45px rgba(0,0,0,0.22)",
                      }}
                    >
                      <Linkedin size={20} />
                    </a>

                    <a
                      href={resumeData.links.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub"
                      className="rounded-full p-3 transition hover:scale-110 active:scale-95"
                      style={{
                        ...ghostBtnStyle,
                        boxShadow: "0 14px 45px rgba(0,0,0,0.22)",
                      }}
                    >
                      <Github size={20} />
                    </a>
                  </div>
                </div>
              </Reveal>
            </Container>
          </section>

          <footer className="py-10 text-center text-sm" style={mutedStyle}>
            © {new Date().getFullYear()} {resumeData.name}
          </footer>
        </main>
      </div>
    </div>
  );
}
