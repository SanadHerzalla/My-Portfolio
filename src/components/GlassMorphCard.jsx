export default function GlassMorphCard({
  children,
  className = "",
  intensity = "medium",
  style = {},
}) {
  const intensityMap = {
    low: { blur: "blur(8px)", opacity: 0.6 },
    medium: { blur: "blur(14px)", opacity: 0.7 },
    high: { blur: "blur(20px)", opacity: 0.8 },
  };

  const { blur, opacity } = intensityMap[intensity];

  return (
    <div
      className={`rounded-3xl border shadow-[0_18px_60px_rgba(0,0,0,0.22)] ${className}`}
      style={{
        background: `rgba(var(--card-bg), ${opacity})`,
        borderColor: `rgba(var(--card-border))`,
        backdropFilter: blur,
        WebkitBackdropFilter: blur,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
