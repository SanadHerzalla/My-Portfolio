import { useEffect, useRef, useState } from "react";

export default function Typewriter({
  text = "",
  speed = 55,          // ms per character
  startDelay = 250,
  className = "",
  onDone,              // ✅ NEW
}) {
  const [out, setOut] = useState("");
  const doneCalledRef = useRef(false);

  useEffect(() => {
    let rafId = 0;
    let timeoutId = 0;

    let startTs = 0;
    let lastLen = 0;

    doneCalledRef.current = false;
    setOut("");

    timeoutId = window.setTimeout(() => {
      const tick = (ts) => {
        if (!startTs) startTs = ts;

        const elapsed = ts - startTs;
        const nextLen = Math.min(text.length, Math.floor(elapsed / speed));

        if (nextLen !== lastLen) {
          lastLen = nextLen;
          setOut(text.slice(0, nextLen));
        }

        if (nextLen < text.length) {
          rafId = window.requestAnimationFrame(tick);
        } else {
          if (!doneCalledRef.current) {
            doneCalledRef.current = true;
            onDone?.();
          }
        }
      };

      rafId = window.requestAnimationFrame(tick);
    }, startDelay);

    return () => {
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(rafId);
    };
  }, [text, speed, startDelay, onDone]);

  return <span className={className}>{out}</span>;
}
