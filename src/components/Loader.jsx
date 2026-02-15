import { useEffect, useState } from "react";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 8 + 2;

      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressInterval);
        setProgress(100);

        setTimeout(() => setStage(1), 300);
        setTimeout(() => setStage(2), 1000);
      } else {
        setProgress(currentProgress);
      }
    }, 60);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-opacity duration-700"
      style={{
        background:
          "radial-gradient(ellipse at center, #1a1f35 0%, #0b1220 100%)",
        opacity: stage === 2 ? 0 : 1,
        pointerEvents: stage === 2 ? "none" : "auto",
      }}
    >
      <div className="absolute inset-0 opacity-20">
        <div
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            width: "100%",
            height: "100%",
            animation: "gridMove 20s linear infinite",
          }}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute rounded-full blur-3xl opacity-30"
          style={{
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(34, 211, 238, 0.4), transparent)",
            top: "-10%",
            left: "-10%",
            animation: "floatSlow 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-30"
          style={{
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.4), transparent)",
            bottom: "-10%",
            right: "-10%",
            animation: "floatSlow 10s ease-in-out infinite reverse",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg px-8">
        <div className="relative">
          <div className="flex justify-center mb-16">
            <div
              className="relative"
              style={{ width: "200px", height: "200px" }}
            >
              <div
                className="absolute inset-0"
                style={{
                  animation: "orbit 3s linear infinite",
                }}
              >
                <div
                  className="absolute rounded-full"
                  style={{
                    width: "12px",
                    height: "12px",
                    background:
                      "linear-gradient(135deg, rgba(34, 211, 238, 1), rgba(99, 102, 241, 1))",
                    boxShadow: "0 0 20px rgba(34, 211, 238, 0.8)",
                    top: "0",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                />
              </div>

              <div
                className="absolute"
                style={{
                  inset: "20px",
                  animation: "orbit 4s linear infinite reverse",
                }}
              >
                <div
                  className="absolute rounded-full"
                  style={{
                    width: "10px",
                    height: "10px",
                    background:
                      "linear-gradient(135deg, rgba(168, 85, 247, 1), rgba(236, 72, 153, 1))",
                    boxShadow: "0 0 20px rgba(168, 85, 247, 0.8)",
                    top: "0",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                />
              </div>

              <div
                className="absolute"
                style={{
                  inset: "40px",
                  animation: "spin 6s linear infinite",
                }}
              >
                <svg
                  viewBox="0 0 120 120"
                  style={{
                    width: "100%",
                    height: "100%",
                    filter: "drop-shadow(0 0 20px rgba(34, 211, 238, 0.6))",
                  }}
                >
                  <polygon
                    points="60,10 110,35 110,85 60,110 10,85 10,35"
                    fill="none"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    strokeDasharray="300"
                    strokeDashoffset={
                      stage === 1 ? 0 : 300 - (progress / 100) * 300
                    }
                    style={{ transition: "stroke-dashoffset 0.3s ease" }}
                  />
                  <defs>
                    <linearGradient
                      id="gradient1"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="rgba(34, 211, 238, 1)" />
                      <stop offset="100%" stopColor="rgba(99, 102, 241, 1)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  animation:
                    stage === 1
                      ? "successPulse 0.6s ease-out"
                      : "pulse 2s ease-in-out infinite",
                }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: "70px",
                    height: "70px",
                    background:
                      stage === 1
                        ? "radial-gradient(circle, rgba(34, 211, 238, 0.6), rgba(34, 211, 238, 0.2))"
                        : "radial-gradient(circle, rgba(34, 211, 238, 0.3), rgba(34, 211, 238, 0.1))",
                    boxShadow:
                      stage === 1
                        ? "0 0 60px rgba(34, 211, 238, 0.8), 0 0 100px rgba(34, 211, 238, 0.4)"
                        : "0 0 40px rgba(34, 211, 238, 0.5)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent)",
                    }}
                  >
                    {stage === 1 ? (
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(34, 211, 238, 1)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <div
                className="h-1.5 rounded-full overflow-hidden relative"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.3)",
                }}
              >
                <div
                  className="h-full rounded-full relative transition-all duration-300 ease-out"
                  style={{
                    width: `${progress}%`,
                    background:
                      "linear-gradient(90deg, rgba(34, 211, 238, 1), rgba(99, 102, 241, 1))",
                    boxShadow:
                      "0 0 20px rgba(34, 211, 238, 0.6), 0 0 40px rgba(99, 102, 241, 0.3)",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                </div>
              </div>

              <div
                className="absolute -bottom-2 left-0 h-8 rounded-full blur-xl transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background:
                    "radial-gradient(ellipse, rgba(34, 211, 238, 0.4), transparent)",
                }}
              />
            </div>

            <div className="text-center space-y-3">
              <div
                className="text-5xl font-bold tracking-tight transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(34, 211, 238, 1), rgba(99, 102, 241, 1))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  transform: stage === 1 ? "scale(1.1)" : "scale(1)",
                }}
              >
                {stage === 1 ? "Ready!" : `${Math.floor(progress)}%`}
              </div>

              <div
                className="text-sm tracking-[0.3em] uppercase font-semibold transition-all duration-300"
                style={{
                  color: "rgba(255, 255, 255, 0.6)",
                  letterSpacing: "0.3em",
                }}
              >
                {stage === 1 ? "Starting Experience" : "Initializing"}
              </div>

              {stage === 0 && (
                <div className="flex justify-center gap-2 pt-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: "rgba(34, 211, 238, 0.6)",
                        animation: `bounce 1.4s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                background:
                  i % 2 === 0
                    ? "rgba(34, 211, 238, 0.6)"
                    : "rgba(99, 102, 241, 0.6)",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `floatParticle ${4 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
                boxShadow: `0 0 10px ${i % 2 === 0 ? "rgba(34, 211, 238, 0.4)" : "rgba(99, 102, 241, 0.4)"}`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.8;
          }
        }

        @keyframes successPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        @keyframes floatSlow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(50px, 50px) scale(1.1);
          }
        }

        @keyframes floatParticle {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          50% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  );
}
