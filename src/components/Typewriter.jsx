import { useEffect, useRef, useState } from "react";

/**
 * Typewriter - fixed for dark + light mode
 * The parent h1 uses bg-clip-text + text-transparent for gradient,
 * but that breaks child spans. We apply the gradient directly here.
 */
export default function Typewriter({
  text = "",
  words,
  interval = 2800,
  speed,
  startDelay,
  className = "",
  onDone,
}) {
  const resolvedWords =
    words ?? (Array.isArray(text) ? text : text ? [text] : []);

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("in");
  const timerRef = useRef(null);
  const didDone = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setPhase("visible"), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (resolvedWords.length <= 1) {
      if (!didDone.current) {
        didDone.current = true;
        onDone?.();
      }
      return;
    }
    const cycle = () => {
      setPhase("out");
      setTimeout(() => {
        setIndex((i) => {
          const next = (i + 1) % resolvedWords.length;
          if (next === 0 && !didDone.current) {
            didDone.current = true;
            onDone?.();
          }
          return next;
        });
        setPhase("in");
        setTimeout(() => setPhase("visible"), 60);
      }, 360);
    };
    timerRef.current = setInterval(cycle, interval);
    return () => clearInterval(timerRef.current);
  }, [resolvedWords.length, interval]);

  const styles = {
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transform: "scale(1) translateY(0px)",
    },
    out: {
      opacity: 0,
      filter: "blur(16px)",
      transform: "scale(0.93) translateY(-10px)",
    },
    in: {
      opacity: 0,
      filter: "blur(16px)",
      transform: "scale(1.07) translateY(12px)",
    },
  };

  const transitions = {
    visible:
      "opacity 480ms cubic-bezier(0.22,1,0.36,1), filter 480ms cubic-bezier(0.22,1,0.36,1), transform 480ms cubic-bezier(0.22,1,0.36,1)",
    out: "opacity 320ms ease-in, filter 320ms ease-in, transform 320ms ease-in",
    in: "none",
  };

  if (!resolvedWords.length) return null;

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        ...styles[phase],
        transition: transitions[phase],
        /* ── gradient applied directly so it works regardless of parent ── */
        background:
          "linear-gradient(135deg, rgb(var(--fg)) 0%, rgb(var(--accent)) 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      }}
    >
      {resolvedWords[index]}
    </span>
  );
}
