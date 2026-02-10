import { useEffect, useState } from "react";

export default function Typewriter({
  text,
  speed = 55,      // ✅ not too slow
  startDelay = 250,
  className = "",
}) {
  const [out, setOut] = useState("");

  useEffect(() => {
    let i = 0;
    let t1 = null;
    let t2 = null;

    t1 = setTimeout(() => {
      t2 = setInterval(() => {
        i += 1;
        setOut(text.slice(0, i));
        if (i >= text.length) clearInterval(t2);
      }, speed);
    }, startDelay);

    return () => {
      if (t1) clearTimeout(t1);
      if (t2) clearInterval(t2);
    };
  }, [text, speed, startDelay]);

  return <span className={className}>{out}</span>;
}
