import { useEffect, useState } from "react";
import useTheme from "./hooks/useTheme";
import { motion, AnimatePresence } from "framer-motion";
import { Linkedin, Github } from "lucide-react";
import DotsBackground from "./components/DotsBackground";
import Container from "./components/Container";
import { resumeData } from "./data/resumeData";
import Reveal from "./components/Reveal";

import Loader from "./components/Loader";
import SkillRadar from "./components/SkillRadar";
import DanglingNav from "./components/DanglingNav";
import Typewriter from "./components/Typewriter";

export default function App() {
  const [loading, setLoading] = useState(true);
  const { theme, toggle } = useTheme();
  const [showAbout, setShowAbout] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <Loader />;

  const skillCategories = [
    {
      title: "Front End",
      items: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind CSS"],
    },
    {
      title: "Back End",
      items: ["Java", "Spring Boot", "Node.js", "NestJS", "REST APIs", "OOP"],
    },
    {
      title: "Databases",
      items: ["MySQL", "MS SQL Server", "Normalization", "Indexes", "Joins", "Advanced Queries"],
    },
  ];

  // theme-aware base classes (NO hardcoded colors)
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

  return (
    <div className="relative min-h-screen" style={{ color: "rgb(var(--fg))" }}>
      <DotsBackground dotCount={420} />

      {/* theme toggle (top-right) */}
      <button
        onClick={toggle}
        className="fixed right-6 top-6 z-50 rounded-full px-4 py-2 text-sm font-semibold transition shadow-lg"
        style={{
          background: `rgba(var(--card-bg))`,
          border: `1px solid rgba(var(--card-border))`,
          color: `rgb(var(--fg))`,
          backdropFilter: "blur(14px)",
        }}
      >
        {theme === "dark" ? "☀ Light" : "🌙 Dark"}
      </button>

      {/* Dangling name + hover menu */}
      <DanglingNav theme={theme} toggleTheme={toggle} />

      <div className="relative z-10">
        <main>
          {/* Hero */}
          <section className="py-16">
            <Container>
              <div className={card} style={cardStyle}>
                <p className="text-sm" style={mutedStyle}>
                  {resumeData.title}
                </p>

                <h1 className="mt-3 text-4xl md:text-5xl font-semibold">
                  <Typewriter text="Software Developer" speed={55} startDelay={250} />
                </h1>

                <p className="mt-3 text-lg" style={mutedStyle}>
                  Welcome to my website
                </p>

                <p className="mx-auto mt-5 max-w-2xl leading-relaxed" style={mutedStyle}>
  <Typewriter
    text={resumeData.description}
    speed={22}
    startDelay={350}
    onDone={() => setShowAbout(true)}
  />
  <span className="type-cursor">|</span>
</p>


                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <a
                    href="#projects"
                    className="rounded-xl px-5 py-2.5 font-medium transition hover:opacity-95"
                    style={primaryBtnStyle}
                  >
                    View Projects
                  </a>

                  <a
                    href="#contact"
                    className="rounded-xl border px-5 py-2.5 transition hover:opacity-95"
                    style={ghostBtnStyle}
                  >
                    Contact
                  </a>
                </div>
              </div>
            </Container>
          </section>

          {/* About */}
<section id="about" className="py-16">
  <Container>
    <AnimatePresence>
      {showAbout && (
        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 10, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className={cardLeft} style={cardStyle}>
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-semibold text-left">About</h2>

              {/* ✅ Circular icon buttons */}
              <div className="flex items-center gap-2">
                <a
                  href={resumeData.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="h-11 w-11 rounded-full border grid place-items-center transition hover:opacity-95"
                  style={ghostBtnStyle}
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href={resumeData.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="h-11 w-11 rounded-full border grid place-items-center transition hover:opacity-95"
                  style={ghostBtnStyle}
                  aria-label="GitHub"
                  title="GitHub"
                >
                  <Github size={18} />
                </a>
              </div>
            </div>

            <p className="mt-4 leading-relaxed text-left" style={mutedStyle}>
              {resumeData.description}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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
                    Scroll/drag to rotate. You must visit all skills to move on.
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

              <div className="grid gap-6 md:grid-cols-2">
                {resumeData.projects.map((p) => (
                  <Reveal key={p.name}>
                    <div className={cardBox} style={cardStyle}>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold">{p.name}</h3>

                        <div className="flex flex-wrap gap-2 justify-center md:justify-end items-center">
                          {p.tech.map((t) => (
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

                      <ul className="mt-4 list-disc pl-5 space-y-2" style={mutedStyle}>
                        {p.points.map((x, i) => (
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
                        animation: `certIn 520ms ease ${(idx * 120)}ms both`,
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

          {/* Education */}
          <section id="education" className="py-16">
            <Container>
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-semibold">Education</h2>
                <p className="mt-2" style={mutedStyle}>
                  Academic background
                </p>
              </div>

              {resumeData.education.map((e) => (
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

                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <a
                      className="rounded-xl px-5 py-2.5 font-medium transition hover:opacity-95"
                      style={primaryBtnStyle}
                      href={`mailto:${resumeData.email}`}
                    >
                      Email Me
                    </a>
                    <a
                      className="rounded-xl border px-5 py-2.5 transition hover:opacity-95"
                      style={ghostBtnStyle}
                      href={resumeData.links.linkedin}
                      target="_blank"
                      rel="noreferrer"
                    >
                      LinkedIn
                    </a>
                    <a
                      className="rounded-xl border px-5 py-2.5 transition hover:opacity-95"
                      style={ghostBtnStyle}
                      href={resumeData.links.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
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
