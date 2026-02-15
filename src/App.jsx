import { useEffect, useState } from "react";
import useTheme from "./hooks/useTheme";
import DotsBackground from "./components/DotsBackground";
import Container from "./components/Container";
import { resumeData } from "./data/resumeData";
import Reveal from "./components/Reveal";
import {
  Mail,
  Linkedin,
  Github,
  ArrowUp,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import Loader from "./components/Loader";
import SkillRadar from "./components/SkillRadar";
import DanglingNav from "./components/DanglingNav";
import Typewriter from "./components/Typewriter";
import MagneticButton from "./components/MagneticButton";
import BentoProjects from "./components/BentoProjects";
import GlassMorphCard from "./components/GlassMorphCard";
import TiltCard from "./components/TiltCard";

export default function App() {
  const [loading, setLoading] = useState(true);
  const { theme, toggle } = useTheme();

  const [showTop, setShowTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800); // Changed from 900 to 1800
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 700);

      // Calculate scroll progress for progress bar
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

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

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const prev = el.style.scrollMarginTop;
    el.style.scrollMarginTop = "96px";

    el.scrollIntoView({ behavior: "smooth", block: "start" });

    setTimeout(() => {
      el.style.scrollMarginTop = prev;
    }, 700);
  };

  return (
    <div className="relative min-h-screen" style={{ color: "rgb(var(--fg))" }}>
      {/* Scroll Progress Bar - Modern 2026 Feature */}
      <div
        className="fixed top-0 left-0 h-1 z-[60] transition-all duration-300"
        style={{
          width: `${scrollProgress}%`,
          background: `linear-gradient(90deg, rgb(var(--accent)), rgba(var(--accent), 0.5))`,
          boxShadow: `0 0 20px rgba(var(--accent), 0.5)`,
        }}
      />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <DotsBackground dotCount={420} />
      </div>

      {/* Modern Theme Toggle Button */}
      <button
        onClick={toggle}
        className="fixed right-6 top-6 z-50 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2.5"
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
            <Sun size={18} className="transition-transform duration-300" />
            <span>Light</span>
          </>
        ) : (
          <>
            <Moon size={18} className="transition-transform duration-300" />
            <span>Dark</span>
          </>
        )}
      </button>

      <DanglingNav theme={theme} toggleTheme={toggle} />

      {/* Enhanced Scroll to Top with Magnetic Effect */}
      {showTop ? (
        <MagneticButton strength={0.4}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-50 rounded-full p-3 transition-all duration-300 hover:scale-110 active:scale-95 group"
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
              size={18}
              className="group-hover:-translate-y-0.5 transition-transform"
            />
          </button>
        </MagneticButton>
      ) : null}

      <div className="relative z-10">
        <main>
          {/* Hero Section with Enhanced Glass Morphism */}
          <section className="py-16 relative overflow-hidden">
            <Container>
              <GlassMorphCard className="p-10 text-center" intensity="high">
                <p
                  className="text-sm tracking-wider uppercase"
                  style={{ color: `rgba(var(--muted))` }}
                >
                  {resumeData.title}
                </p>

                <h1 className="mt-3 text-4xl md:text-6xl font-bold bg-gradient-to-r from-[rgb(var(--fg))] to-[rgba(var(--accent),1)] bg-clip-text text-transparent">
                  <Typewriter
                    text="Sanad Herzalla"
                    speed={55}
                    startDelay={250}
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
                        boxShadow: `0 10px 40px rgba(var(--accent), 0.3)`,
                      }}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        View Projects
                        <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
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
                        WebkitBackdropFilter: "blur(8px)",
                      }}
                    >
                      Contact
                    </button>
                  </MagneticButton>
                </div>
              </GlassMorphCard>
            </Container>
          </section>

          {/* About Section with 3D Tilt Effect */}
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

          {/* Skills Section - Enhanced Radar */}
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

          {/* Projects Section - Bento Grid Layout */}
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

          {/* Certifications with 3D Cards */}
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
                            className="rounded-full border px-3 py-1 text-xs text-center whitespace-nowrap"
                            style={{
                              background: `rgba(var(--accent), 0.1)`,
                              borderColor: `rgba(var(--accent), 0.3)`,
                              color: `rgb(var(--fg))`,
                              backdropFilter: "blur(8px)",
                              WebkitBackdropFilter: "blur(8px)",
                            }}
                          >
                            {c.date}
                          </span>
                        </div>

                        {c.note ? (
                          <p
                            className="mt-4 leading-relaxed"
                            style={{ color: `rgba(var(--muted))` }}
                          >
                            {c.note}
                          </p>
                        ) : null}
                      </GlassMorphCard>
                    </TiltCard>
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

          {/* Education Section */}
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

          {/* Contact Section - Enhanced */}
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

                  <div className="mt-5 flex justify-center gap-4">
                    <MagneticButton strength={0.3}>
                      <a
                        href={`mailto:${resumeData.email}`}
                        aria-label="Email"
                        className="group rounded-full p-3 transition-all duration-300 hover:scale-110 active:scale-95 inline-block"
                        style={{
                          background: `rgba(var(--card-bg))`,
                          border: `1px solid rgba(var(--card-border))`,
                          color: `rgb(var(--fg))`,
                          boxShadow: "0 14px 45px rgba(0,0,0,0.22)",
                          backdropFilter: "blur(14px)",
                          WebkitBackdropFilter: "blur(14px)",
                        }}
                      >
                        <Mail
                          size={20}
                          className="group-hover:rotate-12 transition-transform"
                        />
                      </a>
                    </MagneticButton>

                    <MagneticButton strength={0.3}>
                      <a
                        href={resumeData.links.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="LinkedIn"
                        className="group rounded-full p-3 transition-all duration-300 hover:scale-110 active:scale-95 inline-block"
                        style={{
                          background: `rgba(var(--card-bg))`,
                          border: `1px solid rgba(var(--card-border))`,
                          color: `rgb(var(--fg))`,
                          boxShadow: "0 14px 45px rgba(0,0,0,0.22)",
                          backdropFilter: "blur(14px)",
                          WebkitBackdropFilter: "blur(14px)",
                        }}
                      >
                        <Linkedin
                          size={20}
                          className="group-hover:rotate-12 transition-transform"
                        />
                      </a>
                    </MagneticButton>

                    <MagneticButton strength={0.3}>
                      <a
                        href={resumeData.links.github}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub"
                        className="group rounded-full p-3 transition-all duration-300 hover:scale-110 active:scale-95 inline-block"
                        style={{
                          background: `rgba(var(--card-bg))`,
                          border: `1px solid rgba(var(--card-border))`,
                          color: `rgb(var(--fg))`,
                          boxShadow: "0 14px 45px rgba(0,0,0,0.22)",
                          backdropFilter: "blur(14px)",
                          WebkitBackdropFilter: "blur(14px)",
                        }}
                      >
                        <Github
                          size={20}
                          className="group-hover:rotate-12 transition-transform"
                        />
                      </a>
                    </MagneticButton>
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
