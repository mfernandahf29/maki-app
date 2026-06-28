"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

// Generate particles effect (outside component to avoid purity linter errors)
const generateParticles = (x, y) => {
  const emojis = ["⭐", "✨", "🎉", "🍎"];
  const numParticles = 12;
  const newParticles = [];

  for (let i = 0; i < numParticles; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 100;
    newParticles.push({
      id: Date.now() + i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x,
      y,
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance,
    });
  }
  return newParticles;
};

export default function GamePage() {
  const [showModal, setShowModal] = useState(false);
  const [stars, setStars] = useState(12);
  const [particles, setParticles] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // tracking for styles
  const [isExploding, setIsExploding] = useState(false);

  const launchParticles = (x, y) => {
    const newParticles = generateParticles(x, y);
    setParticles((prev) => [...prev, ...newParticles]);

    // Remove particles after 1s
    setTimeout(() => {
      setParticles((prev) => prev.slice(newParticles.length));
    }, 1000);
  };

  const handleAnswer = (isCorrect, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    if (isCorrect) {
      setSelectedAnswer("correct");
      launchParticles(centerX, centerY);
      setIsExploding(true);
      setStars((s) => s + 1);

      setTimeout(() => {
        setShowModal(true);
      }, 1500);
    } else {
      setSelectedAnswer("incorrect");
      setTimeout(() => setSelectedAnswer(null), 500); // reset after shake
    }
  };

  return (
    <div className="bg-[#F7FCFF] text-on-surface font-body-md relative min-h-screen flex flex-col overflow-hidden">
      {/* Particles Container */}
      <div id="particles-container" className="fixed inset-0 pointer-events-none z-[9999]">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute text-[24px] animate-[volarParticula_1s_ease-out_forwards]"
            style={{
              left: p.x,
              top: p.y,
              "--tx": `${p.tx}px`,
              "--ty": `${p.ty}px`,
            }}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      {/* Top Navigation */}
      <header className="flex items-center justify-between p-4 md:p-6 bg-surface border-b-2 border-surface-variant z-10 relative">
        <Link href="/estudiante/menu">
          <button
            aria-label="Volver"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-high hover:bg-surface-variant transition-colors group"
          >
            <span
              className="material-symbols-outlined text-primary group-hover:-translate-x-1 transition-transform"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              arrow_back
            </span>
          </button>
        </Link>
        <div className="flex flex-col items-center">
          <span className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">
            Matemáticas Básicas
          </span>
          <span className="font-headline-md text-headline-md text-primary">
            Modo Adivinanza
          </span>
        </div>
        <div className="flex items-center gap-2 bg-secondary-container rounded-full px-4 py-2 shadow-sm animate-pulse-badge">
          <span
            className="material-symbols-outlined text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="font-body-xl text-body-xl text-on-secondary-container">
            {stars}
          </span>
        </div>
      </header>

      {/* Progress Track */}
      <div className="w-full px-6 py-4 bg-surface-container-low flex flex-col items-center gap-2 z-10 relative">
        <span className="font-label-lg text-label-lg text-on-surface-variant">
          Pregunta 3 de 5
        </span>
        <div className="w-full max-w-2xl h-4 bg-outline-variant rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: "60%" }}
          ></div>
        </div>
      </div>

      {/* Main Game Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto relative z-0">
        {/* AR Badge */}
        <div className="absolute top-6 right-6 bg-tertiary-container text-on-tertiary-container px-4 py-2 rounded-full font-label-lg flex items-center gap-2 animate-pulse-badge shadow-md z-10">
          <span>✨</span> AR MODE
        </div>

        {/* Central Question Area */}
        <div className="flex flex-col items-center text-center max-w-3xl mb-12">
          <h1 className="font-headline-lg text-[36px] text-on-background mb-8 animate-[slideUp_0.5s_ease-out_forwards]">
            ¿Cuántas manzanas hay en total?
          </h1>
          {/* Central Visual */}
          <div
            className={`text-[7rem] leading-none mb-12 filter drop-shadow-xl select-none ${
              isExploding ? "animate-[arExplode_0.8s_ease-out_forwards]" : "animate-floating"
            }`}
          >
            🍎🍎🍎
          </div>
        </div>

        {/* Answer Grid (2x2) */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl">
          {[
            { label: "Dos", correct: false, id: "ans-1" },
            { label: "Tres", correct: true, id: "ans-2" },
            { label: "Cuatro", correct: false, id: "ans-3" },
            { label: "Cinco", correct: false, id: "ans-4" },
          ].map((ans) => {
            let btnClass =
              "bg-white border-2 border-surface-variant rounded-[1.5rem] shadow-[0_8px_16px_rgba(0,103,130,0.05)] h-32 flex items-center justify-center font-headline-md text-[28px] text-primary hover:bg-surface-container-low transition-colors group relative overflow-hidden";

            // If selected apply error state logic
            if (selectedAnswer === "incorrect" && !ans.correct) {
              btnClass =
                "bg-[#fdeded] border-2 border-error rounded-[1.5rem] h-32 flex items-center justify-center font-headline-md text-[28px] text-error animate-[arShake_0.4s_ease-in-out] relative overflow-hidden";
            } else if (selectedAnswer === "correct" && ans.correct) {
              btnClass =
                "bg-[#eafaf1] border-2 border-verde rounded-[1.5rem] h-32 flex items-center justify-center font-headline-md text-[28px] text-verde relative overflow-hidden";
            }

            return (
              <button
                key={ans.id}
                className={btnClass}
                onClick={(e) => handleAnswer(ans.correct, e)}
              >
                <span className="relative z-10 group-hover:scale-110 transition-transform">
                  {ans.label}
                </span>
                {ans.correct && selectedAnswer === "correct" && (
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none opacity-100 transition-opacity"
                    preserveAspectRatio="none"
                  >
                    <circle
                      className="animate-[expandRing_0.6s_ease-out_forwards]"
                      cx="50%"
                      cy="50%"
                      fill="none"
                      stroke="#2ECC71"
                      strokeWidth="4"
                    ></circle>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </main>

      {/* Celebration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-on-background/80 z-50 flex flex-col items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-surface rounded-[2rem] p-12 max-w-lg w-full flex flex-col items-center text-center shadow-2xl relative overflow-hidden animate-pop-in">
            {/* Confetti background pattern proxy */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, #29abd4 2px, transparent 2px)",
                backgroundSize: "20px 20px",
              }}
            ></div>
            <div className="text-[6rem] mb-6 animate-floating select-none">🦊</div>
            <h2 className="font-headline-lg text-[36px] text-primary mb-4">
              ¡Lo lograste!
            </h2>
            <p className="font-body-lg text-[20px] text-on-surface-variant mb-8">
              Has completado esta lección con éxito.
            </p>

            {/* Star System */}
            <div className="flex gap-4 mb-12">
              {[0.1, 0.3, 0.5].map((delay, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-[4rem] text-secondary-container animate-pop-in"
                  style={{
                    fontVariationSettings: "'FILL' 1",
                    animationDelay: `${delay}s`,
                  }}
                >
                  star
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 w-full">
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
              >
                🔄 Jugar de nuevo
              </Button>
              <Link href="/estudiante/menu" className="w-full">
                <Button variant="secondary">
                  🏠 Volver al Menú
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes volarParticula {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
          }
        }
        @keyframes slideUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes expandRing {
          0% {
            r: 0;
            opacity: 1;
          }
          100% {
            r: 100%;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
