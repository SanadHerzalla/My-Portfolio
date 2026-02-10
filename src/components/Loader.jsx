import { useEffect, useState } from "react";

export default function Loader() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setActive((v) => (v + 1) % 5);
    }, 180);

    return () => clearInterval(i);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <div className="relative flex items-center gap-6">
        {/* stabbing line */}
        <div
          className="absolute -top-8 bottom-[-32px] w-[2px] bg-white/70 transition-all duration-200"
          style={{
            left: `${active * 48 + 12}px`,
          }}
        />

        {/* circles */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="relative flex items-center justify-center"
          >
            <div
              className="h-6 w-6 rounded-full transition-all duration-200"
              style={{
                backgroundColor: active === i ? "#ffffff" : "#ffffff55",
                transform: active === i ? "scale(1.35)" : "scale(1)",
                boxShadow:
                  active === i
                    ? "0 0 20px rgba(255,255,255,0.6)"
                    : "none",
              }}
            />
          </div>
        ))}
      </div>

      {/* subtle text */}
      <div className="absolute bottom-16 text-white/50 text-xs tracking-widest">
        LOADING
      </div>
    </div>
  );
}
