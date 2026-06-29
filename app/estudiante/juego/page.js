"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const EMOJIS = ["🍎", "🍊", "⭐", "🌟", "🎈", "🦋", "🐥", "🍓"];
const CONFETTI_COLORS = ["#29abd4", "#feb246", "#842bd2", "#2ECC71", "#E74C3C", "#F39C12", "#9B59B6", "#1ABC9C"];
const TOTAL_QUESTIONS = 5;

function generateQuestions(grado) {
  const grade = parseInt(grado) || 1;
  const questions = [];

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const genWrongAnswers = (correct, min, max) => {
    const wrong = new Set();
    let attempts = 0;
    while (wrong.size < 3 && attempts < 200) {
      const n = rand(min, max);
      if (n !== correct) wrong.add(n);
      attempts++;
    }
    let offset = 1;
    while (wrong.size < 3) {
      const up = correct + offset;
      const down = correct - offset;
      if (up !== correct) wrong.add(up);
      if (wrong.size < 3 && down !== correct && down >= 0) wrong.add(down);
      offset++;
    }
    return Array.from(wrong).slice(0, 3);
  };

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
  const emoji = EMOJIS[rand(0, EMOJIS.length - 1)];

  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    let question, visual, correct, min, max;

    if (grade <= 2) {
      const a = rand(1, 5);
      const b = rand(1, 10 - a);
      correct = a + b;
      min = 1; max = 10;
      question = `¿Cuánto es ${a} + ${b}?`;
      visual = { type: "emoji", a, b, emoji };
    } else if (grade <= 4) {
      if (Math.random() > 0.5) {
        const a = rand(10, 50);
        const b = rand(1, a - 1);
        correct = a - b;
        min = 1; max = 50;
        question = `¿Cuánto es ${a} − ${b}?`;
        visual = { type: "math", expr: `${a} − ${b}` };
      } else {
        const a = rand(1, 25);
        const b = rand(1, 50 - a);
        correct = a + b;
        min = 1; max = 50;
        question = `¿Cuánto es ${a} + ${b}?`;
        visual = { type: "math", expr: `${a} + ${b}` };
      }
    } else {
      const a = rand(2, 9);
      const b = rand(2, 9);
      correct = a * b;
      min = 4; max = 81;
      question = `¿Cuánto es ${a} × ${b}?`;
      visual = { type: "math", expr: `${a} × ${b}` };
    }

    const wrongAnswers = genWrongAnswers(correct, min, max);
    const answers = shuffle([
      { label: String(correct), correct: true },
      ...wrongAnswers.map((n) => ({ label: String(n), correct: false })),
    ]);

    questions.push({ question, visual, answers });
  }

  return questions;
}

const buildParticles = (x, y) => {
  const emojis = ["⭐", "✨", "🎉", "🌟"];
  return Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const dist = 80 + (i % 3) * 40;
    return {
      id: Date.now() + i,
      emoji: emojis[i % emojis.length],
      x, y,
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist,
    };
  });
};

const buildConfetti = () =>
  Array.from({ length: 60 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${(i / 60) * 100}%`,
    delay: `${(i * 0.04).toFixed(2)}s`,
    duration: `${0.9 + (i % 6) * 0.15}s`,
    rotate: i * 47,
    size: 8 + (i % 4) * 3,
  }));

export default function GamePage() {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [stars, setStars] = useState(0);
  const [particles, setParticles] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isExploding, setIsExploding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [gradoLabel, setGradoLabel] = useState("Matemáticas");

  useEffect(() => {
    const datos = localStorage.getItem("maki_user");
    const user = datos ? JSON.parse(datos) : null;
    setUsuario(user);

    const grado = user?.grado || 1;
    const grade = parseInt(grado);
    if (grade <= 2) setGradoLabel("Sumas Divertidas");
    else if (grade <= 4) setGradoLabel("Sumas y Restas");
    else setGradoLabel("Multiplicaciones");

    setQuestions(generateQuestions(grado));
  }, []);

  const currentQuestion = questions[currentIdx] || null;
  const progress = TOTAL_QUESTIONS > 0 ? ((currentIdx + 1) / TOTAL_QUESTIONS) * 100 : 0;

  const launchParticles = (x, y) => {
    const ps = buildParticles(x, y);
    setParticles((prev) => [...prev, ...ps]);
    setTimeout(() => setParticles((prev) => prev.slice(ps.length)), 1100);
  };

  const saveProgress = async (userId, correctCount) => {
    if (!userId) return;
    const progresoVal = Math.round((correctCount / TOTAL_QUESTIONS) * 100);
    try {
      await supabase.from("progreso").upsert(
        { user_id: userId, curso: "mate", progreso: progresoVal },
        { onConflict: "user_id,curso" }
      );
    } catch (_) {}
  };

  const handleAnswer = (isCorrect, e) => {
    if (selectedAnswer) return;
    const rect = e.currentTarget.getBoundingClientRect();
    launchParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

    if (isCorrect) {
      setSelectedAnswer("correct");
      setIsExploding(true);
      const newStars = stars + 1;
      setStars(newStars);

      setTimeout(() => {
        setIsExploding(false);
        if (currentIdx + 1 >= TOTAL_QUESTIONS) {
          const pieces = buildConfetti();
          setConfetti(pieces);
          setTimeout(() => setConfetti([]), 3500);
          setShowModal(true);
          saveProgress(usuario?.id, newStars);
        } else {
          setCurrentIdx((i) => i + 1);
          setSelectedAnswer(null);
        }
      }, 1200);
    } else {
      setSelectedAnswer("incorrect");
      setTimeout(() => setSelectedAnswer(null), 500);
    }
  };

  const handleRestart = () => {
    const datos = localStorage.getItem("maki_user");
    const user = datos ? JSON.parse(datos) : null;
    setQuestions(generateQuestions(user?.grado || 1));
    setCurrentIdx(0);
    setStars(0);
    setShowModal(false);
    setSelectedAnswer(null);
    setIsExploding(false);
    setConfetti([]);
  };

  if (!currentQuestion && !showModal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7FCFF]">
        <p className="text-on-surface-variant font-body-lg">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F7FCFF] text-on-surface font-body-md relative min-h-screen flex flex-col overflow-hidden">
      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute text-[22px] animate-[volarParticula_1s_ease-out_forwards]"
            style={{ left: p.x, top: p.y, "--tx": `${p.tx}px`, "--ty": `${p.ty}px` }}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      {/* Header */}
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
          <span className="font-headline-md text-headline-md text-primary">{gradoLabel}</span>
        </div>
        <div className="flex items-center gap-2 bg-secondary-container rounded-full px-4 py-2 shadow-sm">
          <span
            className="material-symbols-outlined text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="font-body-xl text-body-xl text-on-secondary-container">{stars}</span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full px-6 py-4 bg-surface-container-low flex flex-col items-center gap-2 z-10 relative">
        <span className="font-label-lg text-label-lg text-on-surface-variant">
          Pregunta {Math.min(currentIdx + 1, TOTAL_QUESTIONS)} de {TOTAL_QUESTIONS}
        </span>
        <div className="w-full max-w-2xl h-4 bg-outline-variant rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Game Area */}
      {currentQuestion && (
        <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 relative z-0">
          <div className="flex flex-col items-center text-center max-w-3xl w-full mb-10">
            <h1 className="font-headline-lg text-[28px] md:text-[36px] text-on-background mb-8 animate-[slideUp_0.4s_ease-out_forwards]">
              {currentQuestion.question}
            </h1>

            {/* Visual */}
            {currentQuestion.visual.type === "emoji" ? (
              <div
                className={`flex flex-wrap justify-center items-center gap-2 mb-10 p-4 ${
                  isExploding ? "animate-[arExplode_0.7s_ease-out_forwards]" : "animate-floating"
                }`}
              >
                <div className="flex flex-wrap justify-center gap-1">
                  {Array.from({ length: currentQuestion.visual.a }, (_, i) => (
                    <span key={i} className="text-[2.5rem] md:text-[3rem] drop-shadow select-none">
                      {currentQuestion.visual.emoji}
                    </span>
                  ))}
                </div>
                <span className="text-[2rem] text-on-surface-variant mx-2">+</span>
                <div className="flex flex-wrap justify-center gap-1">
                  {Array.from({ length: currentQuestion.visual.b }, (_, i) => (
                    <span key={i} className="text-[2.5rem] md:text-[3rem] drop-shadow select-none">
                      {currentQuestion.visual.emoji}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={`text-[4rem] md:text-[6rem] font-bold text-primary leading-none mb-10 select-none bg-primary-container/20 px-8 py-6 rounded-3xl ${
                  isExploding ? "animate-[arExplode_0.7s_ease-out_forwards]" : "animate-floating"
                }`}
              >
                {currentQuestion.visual.expr}
              </div>
            )}
          </div>

          {/* Answers */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl">
            {currentQuestion.answers.map((ans, i) => {
              let btnClass =
                "bg-white border-2 border-surface-variant rounded-[1.5rem] shadow-[0_8px_16px_rgba(0,103,130,0.05)] h-28 md:h-32 flex items-center justify-center font-headline-md text-[26px] md:text-[30px] text-primary hover:bg-surface-container-low transition-colors relative overflow-hidden";
              if (selectedAnswer === "incorrect" && !ans.correct) {
                btnClass =
                  "bg-[#fdeded] border-2 border-error rounded-[1.5rem] h-28 md:h-32 flex items-center justify-center font-headline-md text-[26px] md:text-[30px] text-error animate-[arShake_0.4s_ease-in-out] relative overflow-hidden";
              } else if (selectedAnswer === "correct" && ans.correct) {
                btnClass =
                  "bg-[#eafaf1] border-2 border-[#2ECC71] rounded-[1.5rem] h-28 md:h-32 flex items-center justify-center font-headline-md text-[26px] md:text-[30px] text-[#2ECC71] relative overflow-hidden";
              }
              return (
                <button key={i} className={btnClass} onClick={(e) => handleAnswer(ans.correct, e)}>
                  <span className="relative z-10">{ans.label}</span>
                </button>
              );
            })}
          </div>
        </main>
      )}

      {/* Celebration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          {/* Confetti */}
          {confetti.map((p) => (
            <div
              key={p.id}
              className="absolute pointer-events-none"
              style={{
                top: "-30px",
                left: p.left,
                animation: `confettiFall ${p.duration} ${p.delay} ease-in forwards`,
              }}
            >
              <div
                style={{
                  width: p.size,
                  height: p.size + 6,
                  backgroundColor: p.color,
                  borderRadius: 3,
                  transform: `rotate(${p.rotate}deg)`,
                }}
              />
            </div>
          ))}

          {/* Modal Card */}
          <div className="bg-white rounded-[2rem] p-8 md:p-12 max-w-lg w-full flex flex-col items-center text-center shadow-2xl relative z-10 animate-[popInBig_0.5s_cubic-bezier(0.34,1.56,0.64,1)_forwards] max-h-[95vh] overflow-y-auto">
            <div className="text-[4.5rem] mb-2 animate-floating select-none">🦊</div>
            <div className="text-[2.5rem] mb-4 select-none">🎉🎊🎉</div>
            <h2 className="font-headline-lg text-[34px] md:text-[40px] text-primary mb-3">
              ¡Lo lograste!
            </h2>
            <p className="font-body-lg text-[18px] text-on-surface-variant mb-6">
              Completaste el juego con{" "}
              <strong className="text-secondary text-[22px]">{stars}</strong>{" "}
              {stars === 1 ? "respuesta correcta" : "respuestas correctas"}.
            </p>

            {/* Stars */}
            <div className="flex gap-3 mb-8">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-[3.5rem] text-secondary-container"
                  style={{
                    fontVariationSettings: "'FILL' 1",
                    animation: `popIn 0.4s ${i * 0.15}s cubic-bezier(0.34,1.56,0.64,1) both`,
                  }}
                >
                  star
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-4 w-full">
              <Link href="/estudiante/menu" className="w-full">
                <button className="w-full bg-primary text-on-primary font-headline-md text-[20px] py-5 rounded-2xl shadow-[0_6px_0_rgba(0,83,110,0.4)] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3">
                  🏠 Volver al Menú
                </button>
              </Link>
              <button
                onClick={handleRestart}
                className="w-full bg-surface-container-high text-primary font-body-lg text-[18px] py-4 rounded-2xl border-2 border-primary/20 hover:bg-primary-container/20 transition-colors flex items-center justify-center gap-2"
              >
                🔄 Jugar de nuevo
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes volarParticula {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
        @keyframes slideUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes arExplode {
          0% { transform: scale(1); }
          40% { transform: scale(1.35); }
          70% { transform: scale(0.92); }
          100% { transform: scale(1); }
        }
        @keyframes arShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0.2; }
        }
        @keyframes popInBig {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
