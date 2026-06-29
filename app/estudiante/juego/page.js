"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const EMOJIS = ["🍎", "🍊", "⭐", "🌟", "🎈", "🦋", "🐥", "🍓"];
const CONFETTI_COLORS = ["#29abd4", "#feb246", "#842bd2", "#2ECC71", "#E74C3C", "#F39C12", "#9B59B6", "#1ABC9C"];
const TOTAL_QUESTIONS = 5;

// Colores fijos para los 4 botones de respuesta
const BTN_COLORS = [
  { bg: "#FFD740", text: "#4a3000", shadow: "#c49400" }, // amarillo
  { bg: "#29abd4", text: "#ffffff", shadow: "#1a7a99" }, // azul
  { bg: "#2ECC71", text: "#ffffff", shadow: "#1a9a52" }, // verde
  { bg: "#E74C3C", text: "#ffffff", shadow: "#b83226" }, // rojo
];

// ── Matemáticas ───────────────────────────────────────────────────────────────
function generateMateQuestions(grado) {
  const grade = parseInt(grado) || 1;
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
  const genWrong = (correct, min, max) => {
    const wrong = new Set();
    let attempts = 0;
    while (wrong.size < 3 && attempts < 200) {
      const n = rand(min, max);
      if (n !== correct) wrong.add(n);
      attempts++;
    }
    let offset = 1;
    while (wrong.size < 3) {
      const up = correct + offset, down = correct - offset;
      if (up !== correct) wrong.add(up);
      if (wrong.size < 3 && down !== correct && down >= 0) wrong.add(down);
      offset++;
    }
    return Array.from(wrong).slice(0, 3);
  };
  const emoji = EMOJIS[rand(0, EMOJIS.length - 1)];
  return Array.from({ length: TOTAL_QUESTIONS }, () => {
    let question, visual, correct, min, max;
    if (grade <= 2) {
      const a = rand(1, 5), b = rand(1, 10 - a);
      correct = a + b; min = 1; max = 10;
      question = `¿Cuánto es ${a} + ${b}?`;
      visual = { type: "emoji", a, b, emoji };
    } else if (grade <= 4) {
      if (Math.random() > 0.5) {
        const a = rand(10, 50), b = rand(1, a - 1);
        correct = a - b; min = 1; max = 50;
        question = `¿Cuánto es ${a} − ${b}?`;
        visual = { type: "math", expr: `${a} − ${b}` };
      } else {
        const a = rand(1, 25), b = rand(1, 50 - a);
        correct = a + b; min = 1; max = 50;
        question = `¿Cuánto es ${a} + ${b}?`;
        visual = { type: "math", expr: `${a} + ${b}` };
      }
    } else {
      const a = rand(2, 9), b = rand(2, 9);
      correct = a * b; min = 4; max = 81;
      question = `¿Cuánto es ${a} × ${b}?`;
      visual = { type: "math", expr: `${a} × ${b}` };
    }
    return {
      question, visual,
      answers: shuffle([
        { label: String(correct), correct: true },
        ...genWrong(correct, min, max).map((n) => ({ label: String(n), correct: false })),
      ]),
    };
  });
}

// ── Lenguaje ──────────────────────────────────────────────────────────────────
const LENGUAJE_BANK = [
  { q: "¿Cuál es la primera letra de MANZANA?", emoji: "🍎", word: "MANZANA",  ok: "M", no: ["A", "N", "Z"] },
  { q: "¿Qué letra falta en C_SA?",              emoji: "🏠", word: "C_SA",     ok: "A", no: ["O", "U", "I"] },
  { q: "¿Cuántas letras tiene GATO?",            emoji: "🐱", word: "GATO",     ok: "4", no: ["3", "5", "6"] },
  { q: "¿Cuál es la última letra de PERRO?",     emoji: "🐶", word: "PERRO",    ok: "O", no: ["R", "E", "P"] },
  { q: "¿Qué letra falta en PE_RO?",             emoji: "🐶", word: "PE_RO",    ok: "R", no: ["A", "S", "T"] },
  { q: "¿Cuál es la primera letra de OSO?",      emoji: "🐻", word: "OSO",      ok: "O", no: ["S", "A", "U"] },
  { q: "¿Cuántas letras tiene LIBRO?",           emoji: "📚", word: "LIBRO",    ok: "5", no: ["4", "6", "3"] },
  { q: "¿Qué letra falta en S_L?",               emoji: "☀️", word: "S_L",      ok: "O", no: ["A", "I", "E"] },
  { q: "¿Cuál es la primera letra de ELEFANTE?", emoji: "🐘", word: "ELEFANTE", ok: "E", no: ["L", "F", "A"] },
  { q: "¿Cuántas letras tiene LUNA?",            emoji: "🌙", word: "LUNA",     ok: "4", no: ["3", "5", "2"] },
  { q: "¿Qué letra falta en AG_A?",              emoji: "💧", word: "AG_A",     ok: "U", no: ["O", "A", "I"] },
  { q: "¿Cuál es la última letra de ÁRBOL?",     emoji: "🌳", word: "ÁRBOL",    ok: "L", no: ["O", "B", "R"] },
  { q: "¿Cuántas letras tiene PATO?",            emoji: "🦆", word: "PATO",     ok: "4", no: ["3", "5", "6"] },
  { q: "¿Qué letra falta en P_Z?",               emoji: "🐟", word: "P_Z",      ok: "E", no: ["A", "I", "O"] },
  { q: "¿Cuál es la primera letra de FLOR?",     emoji: "🌸", word: "FLOR",     ok: "F", no: ["L", "O", "R"] },
];

function generateLenguajeQuestions() {
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
  return shuffle(LENGUAJE_BANK).slice(0, TOTAL_QUESTIONS).map((item) => ({
    question: item.q,
    visual: { type: "letras", emoji: item.emoji, word: item.word },
    answers: shuffle([
      { label: item.ok, correct: true },
      ...item.no.map((a) => ({ label: a, correct: false })),
    ]),
  }));
}

// ── Ciencias ──────────────────────────────────────────────────────────────────
const CIENCIAS_BANK = [
  { q: "¿Qué animal vive en el agua?",                 w: "🌊  ¿En el agua?",     ok: "🐟 Pez",             no: ["🐕 Perro", "🐎 Caballo", "🐦 Pájaro"] },
  { q: "¿Qué necesita una planta para crecer?",        w: "🌱  Planta",            ok: "☀️ Sol y agua",       no: ["❄️ Nieve", "🪨 Piedras", "🍬 Dulces"] },
  { q: "¿Qué animal pone huevos?",                     w: "🥚  Huevos",            ok: "🐔 Gallina",          no: ["🐕 Perro", "🐱 Gato", "🐖 Cerdo"] },
  { q: "¿Dónde vive un pez?",                          w: "🐟  Pez",               ok: "💧 Agua",             no: ["🏜️ Desierto", "🌳 Árbol", "🏔️ Montaña"] },
  { q: "¿Qué parte de la planta está bajo la tierra?", w: "🌿  Planta",            ok: "🌱 Raíz",             no: ["🍃 Hoja", "🌸 Flor", "🌲 Tronco"] },
  { q: "¿Qué animal tiene 4 patas y ladra?",           w: "🐾  ¿Quién soy?",      ok: "🐕 Perro",            no: ["🐟 Pez", "🐦 Pájaro", "🐛 Gusano"] },
  { q: "¿Qué hace el Sol para las plantas?",           w: "☀️   Sol",              ok: "🌱 Las hace crecer",  no: ["❄️ Las congela", "💨 Las mueve", "🌧️ Las moja"] },
  { q: "¿Qué animal puede volar?",                     w: "☁️   ¿Quién vuela?",   ok: "🦋 Mariposa",         no: ["🐢 Tortuga", "🐍 Serpiente", "🐸 Rana"] },
  { q: "¿De dónde viene la leche?",                    w: "🥛  Leche",             ok: "🐄 Vaca",             no: ["🐟 Pez", "🐔 Gallina", "🐸 Rana"] },
  { q: "¿Qué animal hace miel?",                       w: "🍯  Miel",              ok: "🐝 Abeja",            no: ["🦟 Mosquito", "🦋 Mariposa", "🕷️ Araña"] },
  { q: "¿Qué tienen las plantas para captar la luz?",  w: "🌿  Planta",            ok: "🍃 Hojas",            no: ["🌸 Flores", "🌱 Raíces", "🌲 Tronco"] },
  { q: "¿Qué animal tiene rayas negras y blancas?",    w: "🦓  ¿Quién soy?",      ok: "🦓 Cebra",            no: ["🐅 Tigre", "🐘 Elefante", "🦁 León"] },
  { q: "¿Qué necesitamos beber todos los días?",       w: "💧  ¿Qué es?",         ok: "💧 Agua",             no: ["🧃 Jugo", "☕ Café", "🥤 Refresco"] },
  { q: "¿Qué animal es el más grande del mar?",        w: "🌊  Mar",               ok: "🐋 Ballena",          no: ["🐟 Pez", "🦀 Cangrejo", "🐙 Pulpo"] },
  { q: "¿De qué color son las hojas de los árboles?",  w: "🌳  Árbol",             ok: "💚 Verde",            no: ["❤️ Rojo", "💜 Morado", "🧡 Naranja"] },
];

function generateCienciasQuestions() {
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
  return shuffle(CIENCIAS_BANK).slice(0, TOTAL_QUESTIONS).map((item) => ({
    question: item.q,
    visual: { type: "word", word: item.w, curso: "ciencias" },
    answers: shuffle([
      { label: item.ok, correct: true },
      ...item.no.map((a) => ({ label: a, correct: false })),
    ]),
  }));
}

// ── Particles / Confetti ──────────────────────────────────────────────────────
const buildParticles = (x, y) => {
  const emojis = ["⭐", "✨", "🎉", "🌟"];
  return Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const dist = 80 + (i % 3) * 40;
    return { id: Date.now() + i, emoji: emojis[i % emojis.length], x, y, tx: Math.cos(angle) * dist, ty: Math.sin(angle) * dist };
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

const CURSO_META = {
  mate:     { titulo: "Matemáticas Básicas" },
  lenguaje: { titulo: "Palabras Amigas" },
  ciencias: { titulo: "Ciencias Naturales" },
};

// Gradientes del visual según curso
const WORD_GRADIENT = {
  lenguaje: "linear-gradient(135deg, #1a8fb5 0%, #0d5fa3 100%)",
  ciencias:  "linear-gradient(135deg, #1a9a52 0%, #0d7a3a 100%)",
  default:   "linear-gradient(135deg, #29abd4 0%, #1a6fa3 100%)",
};

// ── Componente ────────────────────────────────────────────────────────────────
export default function GamePage() {
  const [questions, setQuestions]           = useState([]);
  const [currentIdx, setCurrentIdx]         = useState(0);
  const [stars, setStars]                   = useState(0);
  const [particles, setParticles]           = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [clickedIdx, setClickedIdx]         = useState(null);
  const [isExploding, setIsExploding]       = useState(false);
  const [showModal, setShowModal]           = useState(false);
  const [confetti, setConfetti]             = useState([]);
  const [usuario, setUsuario]               = useState(null);
  const [cursoLabel, setCursoLabel]         = useState("Matemáticas Básicas");
  const [modeLabel, setModeLabel]           = useState("Adivina");
  const [cursoKey, setCursoKey]             = useState("mate");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const curso = params.get("curso") || "mate";
    setCursoKey(curso);
    setCursoLabel(CURSO_META[curso]?.titulo || "Matemáticas Básicas");

    const datos = localStorage.getItem("maki_user");
    const user = datos ? JSON.parse(datos) : null;
    setUsuario(user);
    const grade = parseInt(user?.grado || 1);

    if (curso === "mate") {
      if (grade <= 2) setModeLabel("Sumas Divertidas");
      else if (grade <= 4) setModeLabel("Sumas y Restas");
      else setModeLabel("Multiplicaciones");
      setQuestions(generateMateQuestions(grade));
    } else if (curso === "lenguaje") {
      setModeLabel("Letras y Palabras");
      setQuestions(generateLenguajeQuestions());
    } else if (curso === "ciencias") {
      setModeLabel("Animales y Plantas");
      setQuestions(generateCienciasQuestions());
    } else {
      setModeLabel("Preguntas");
      setQuestions(generateMateQuestions(grade));
    }
  }, []);

  const currentQuestion = questions[currentIdx] || null;
  const progress = ((currentIdx + 1) / TOTAL_QUESTIONS) * 100;

  const launchParticles = (x, y) => {
    const ps = buildParticles(x, y);
    setParticles((prev) => [...prev, ...ps]);
    setTimeout(() => setParticles((prev) => prev.slice(ps.length)), 1100);
  };

  const saveProgress = async (userId, correctCount, curso) => {
    console.log("[MAKI] saveProgress →", { userId, correctCount, curso });
    if (!userId) {
      console.warn("[MAKI] saveProgress: sin userId, abortando");
      return;
    }
    const progresoVal = Math.round((correctCount / TOTAL_QUESTIONS) * 100);
    try {
      const result = await supabase.from("progreso").upsert(
        { usuario_id: userId, curso, progreso: progresoVal },
        { onConflict: "usuario_id,curso" }
      );
      console.log("[MAKI] saveProgress OK →", result);
    } catch (err) {
      console.error("[MAKI] saveProgress ERROR →", err);
    }
  };

  const handleAnswer = (isCorrect, ansIdx, e) => {
    if (selectedAnswer) return;
    setClickedIdx(ansIdx);
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
          saveProgress(usuario?.id, newStars, cursoKey);
        } else {
          setCurrentIdx((i) => i + 1);
          setSelectedAnswer(null);
          setClickedIdx(null);
        }
      }, 1200);
    } else {
      setSelectedAnswer("incorrect");
      setTimeout(() => { setSelectedAnswer(null); setClickedIdx(null); }, 600);
    }
  };

  const handleRestart = () => {
    const params = new URLSearchParams(window.location.search);
    const curso = params.get("curso") || "mate";
    const datos = localStorage.getItem("maki_user");
    const user = datos ? JSON.parse(datos) : null;
    const grade = parseInt(user?.grado || 1);
    if (curso === "lenguaje") setQuestions(generateLenguajeQuestions());
    else if (curso === "ciencias") setQuestions(generateCienciasQuestions());
    else setQuestions(generateMateQuestions(grade));
    setCurrentIdx(0); setStars(0); setShowModal(false);
    setSelectedAnswer(null); setClickedIdx(null); setIsExploding(false); setConfetti([]);
  };

  if (!currentQuestion && !showModal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7FCFF]">
        <p className="text-on-surface-variant font-body-lg animate-pulse">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F7FCFF] text-on-surface font-body-md relative min-h-screen flex flex-col">

      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        {particles.map((p) => (
          <div key={p.id} className="absolute text-[22px] animate-[volarParticula_1s_ease-out_forwards]"
            style={{ left: p.x, top: p.y, "--tx": `${p.tx}px`, "--ty": `${p.ty}px` }}>
            {p.emoji}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-surface border-b-2 border-surface-variant z-10 relative">
        <Link href="/estudiante/menu">
          <button aria-label="Volver"
            className="flex items-center justify-center w-11 h-11 rounded-full bg-surface-container-high hover:bg-surface-variant transition-colors group">
            <span className="material-symbols-outlined text-primary group-hover:-translate-x-1 transition-transform"
              style={{ fontVariationSettings: "'FILL' 1" }}>arrow_back</span>
          </button>
        </Link>
        <div className="flex flex-col items-center text-center">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">{cursoLabel}</span>
          <span className="text-lg font-bold text-primary leading-tight">{modeLabel}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-secondary-container rounded-full px-3 py-1.5 shadow-sm">
          <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          <span className="font-bold text-lg text-on-secondary-container">{stars}</span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full px-4 py-2.5 bg-surface-container-low flex flex-col items-center gap-1.5 z-10 relative">
        <span className="text-sm font-semibold text-on-surface-variant">
          Pregunta {Math.min(currentIdx + 1, TOTAL_QUESTIONS)} de {TOTAL_QUESTIONS}
        </span>
        <div className="w-full max-w-2xl h-3 bg-outline-variant rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* ── Game Area: layout horizontal para lenguaje ── */}
      {currentQuestion && currentQuestion.visual.type === "letras" ? (
        <main className="flex-1 flex flex-row items-stretch overflow-hidden">
          {/* LEFT: emoji gigante */}
          <div className="w-[40%] shrink-0 flex items-center justify-center bg-[#e8f4ff] border-r-4 border-[#29abd4]">
            <span className="text-[10rem] leading-none select-none">{currentQuestion.visual.emoji}</span>
          </div>
          {/* RIGHT: pregunta + letras + botones */}
          <div className="w-[60%] min-w-0 flex flex-col items-center justify-center gap-6 px-4 py-6 overflow-y-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-on-background text-center leading-snug">
              {currentQuestion.question}
            </h1>
            <div className="flex flex-wrap justify-center gap-2">
              {currentQuestion.visual.word.split("").map((ch, i) => (
                <div key={i}
                  className="flex items-center justify-center rounded-xl font-black text-5xl select-none"
                  style={{
                    width: 80, height: 80,
                    backgroundColor: ch === "_" ? "#FFD740" : "#29abd4",
                    color: ch === "_" ? "#4a3000" : "white",
                    boxShadow: "0 4px 0 rgba(0,0,0,0.2)",
                  }}>
                  {ch === "_" ? "?" : ch}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.answers.map((ans, i) => {
                const c = BTN_COLORS[i % 4];
                let extraClass = "";
                if (selectedAnswer === "correct" && ans.correct) {
                  extraClass = "ring-4 ring-white/80 ring-offset-2 brightness-110";
                } else if (selectedAnswer === "incorrect" && i === clickedIdx) {
                  extraClass = "animate-[arShake_0.4s_ease-in-out] opacity-70";
                } else if (selectedAnswer !== null) {
                  extraClass = "opacity-60";
                }
                return (
                  <button key={i}
                    className={`flex items-center justify-center font-black text-4xl md:text-5xl rounded-2xl cursor-pointer transition-all relative select-none ${extraClass}`}
                    style={{
                      width: 150, height: 150,
                      backgroundColor: c.bg, color: c.text,
                      boxShadow: `0 6px 0 ${c.shadow}`,
                    }}
                    onClick={(e) => handleAnswer(ans.correct, i, e)}>
                    <span className="relative z-10">{ans.label}</span>
                    {selectedAnswer === "correct" && ans.correct && (
                      <span className="absolute top-2 right-3 text-2xl">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </main>
      ) : currentQuestion ? (
        /* ── Game Area: layout vertical para mate y ciencias ── */
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 gap-5 overflow-y-auto">

          {/* Pregunta */}
          <h1 className="text-2xl md:text-3xl font-bold text-on-background text-center leading-snug max-w-2xl animate-[slideUp_0.4s_ease-out_forwards]">
            {currentQuestion.question}
          </h1>

          {/* Visual: emojis (mate grado 1-2) */}
          {currentQuestion.visual.type === "emoji" && (
            <div className={`flex flex-wrap justify-center items-center gap-3 bg-[#FFF8E7] border-4 border-[#FFD740] rounded-3xl px-6 py-5 shadow-lg w-full max-w-xl ${isExploding ? "animate-[arExplode_0.7s_ease-out_forwards]" : "animate-floating"}`}>
              <div className="flex flex-wrap justify-center gap-1">
                {Array.from({ length: currentQuestion.visual.a }, (_, i) => (
                  <span key={i} className="text-5xl md:text-6xl select-none drop-shadow">{currentQuestion.visual.emoji}</span>
                ))}
              </div>
              <span className="text-3xl font-black text-[#c49400] mx-1">+</span>
              <div className="flex flex-wrap justify-center gap-1">
                {Array.from({ length: currentQuestion.visual.b }, (_, i) => (
                  <span key={i} className="text-5xl md:text-6xl select-none drop-shadow">{currentQuestion.visual.emoji}</span>
                ))}
              </div>
            </div>
          )}

          {/* Visual: expresión matemática */}
          {currentQuestion.visual.type === "math" && (
            <div className={`w-full max-w-xl rounded-3xl px-8 py-6 text-center shadow-xl select-none ${isExploding ? "animate-[arExplode_0.7s_ease-out_forwards]" : "animate-floating"}`}
              style={{ background: "linear-gradient(135deg, #e8f4ff 0%, #c5e0ff 100%)", border: "4px solid #29abd4" }}>
              <span className="text-6xl md:text-7xl font-black text-primary tracking-wide">{currentQuestion.visual.expr}</span>
            </div>
          )}

          {/* Visual: ciencias */}
          {currentQuestion.visual.type === "word" && (
            <div
              className={`w-full max-w-xl rounded-3xl px-8 py-7 text-center shadow-xl select-none ${isExploding ? "animate-[arExplode_0.7s_ease-out_forwards]" : "animate-floating"}`}
              style={{
                background: WORD_GRADIENT[currentQuestion.visual.curso] || WORD_GRADIENT.default,
                border: "4px solid rgba(255,255,255,0.3)",
              }}
            >
              <span className="text-4xl md:text-5xl font-black text-white tracking-widest leading-tight break-words">
                {currentQuestion.visual.word}
              </span>
            </div>
          )}

          {/* Botones de respuesta — 4 colores fijos */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 w-full max-w-xl">
            {currentQuestion.answers.map((ans, i) => {
              const c = BTN_COLORS[i % 4];
              let extraClass = "";

              if (selectedAnswer === "correct" && ans.correct) {
                extraClass = "ring-4 ring-white/80 ring-offset-2 brightness-110";
              } else if (selectedAnswer === "incorrect" && i === clickedIdx) {
                extraClass = "animate-[arShake_0.4s_ease-in-out] opacity-70";
              } else if (selectedAnswer !== null) {
                extraClass = "opacity-60";
              }

              return (
                <button
                  key={i}
                  className={`w-full flex items-center justify-center font-bold text-xl md:text-2xl rounded-2xl cursor-pointer transition-all relative overflow-hidden px-3 py-6 md:py-8 text-center leading-snug select-none ${extraClass}`}
                  style={{
                    backgroundColor: c.bg,
                    color: c.text,
                    boxShadow: `0 6px 0 ${c.shadow}`,
                    minHeight: "5rem",
                  }}
                  onClick={(e) => handleAnswer(ans.correct, i, e)}
                >
                  <span className="relative z-10">{ans.label}</span>
                  {selectedAnswer === "correct" && ans.correct && (
                    <span className="absolute top-2 right-3 text-2xl">✓</span>
                  )}
                </button>
              );
            })}
          </div>

        </main>
      ) : null}

      {/* ── Celebration Modal ── */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.78)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          {confetti.map((p) => (
            <div key={p.id} style={{ position: "absolute", top: "-30px", left: p.left, pointerEvents: "none", animation: `confettiFall ${p.duration} ${p.delay} ease-in forwards` }}>
              <div style={{ width: p.size, height: p.size + 6, backgroundColor: p.color, borderRadius: 3, transform: `rotate(${p.rotate}deg)` }} />
            </div>
          ))}
          <div className="bg-white" style={{ position: "relative", zIndex: 10, borderRadius: "1.75rem", padding: "36px 32px", width: "min(400px, calc(100vw - 16px))", minWidth: "300px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 48px rgba(0,0,0,0.35)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", animation: "popInBig 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
            <div style={{ fontSize: "4rem", marginBottom: "4px", userSelect: "none" }}>🦊</div>
            <div style={{ fontSize: "2rem", marginBottom: "12px", userSelect: "none" }}>🎉🎊🎉</div>
            <h2 className="text-primary" style={{ fontSize: "1.9rem", fontWeight: 800, lineHeight: 1.15, marginBottom: "10px" }}>¡Lo lograste!</h2>
            <p className="text-on-surface-variant" style={{ fontSize: "1rem", lineHeight: 1.55, marginBottom: "20px" }}>
              Completaste el juego con{" "}
              <strong className="text-secondary" style={{ fontSize: "1.15rem" }}>{stars}</strong>{" "}
              {stars === 1 ? "respuesta correcta" : "respuestas correctas"}.
            </p>
            <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
              {[0, 1, 2].map((i) => (
                <span key={i} className="material-symbols-outlined text-secondary-container" style={{ fontSize: "3rem", fontVariationSettings: "'FILL' 1", animation: `popIn 0.4s ${i * 0.15}s cubic-bezier(0.34,1.56,0.64,1) both` }}>star</span>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
              <Link href="/estudiante/menu" style={{ display: "block", width: "100%" }}>
                <button className="bg-primary text-on-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "18px 20px", borderRadius: "14px", border: "none", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 0 rgba(0,60,90,0.35)" }}>
                  🏠 Volver al Menú
                </button>
              </Link>
              <button onClick={handleRestart} className="text-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "14px 20px", borderRadius: "14px", border: "2px solid rgba(0,103,130,0.25)", backgroundColor: "#f2f7fb", fontSize: "1rem", fontWeight: 600, cursor: "pointer" }}>
                🔄 Jugar de nuevo
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes volarParticula { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0} }
        @keyframes slideUp { 0%{transform:translateY(16px);opacity:0} 100%{transform:translateY(0);opacity:1} }
        @keyframes arExplode { 0%{transform:scale(1)} 40%{transform:scale(1.3)} 70%{transform:scale(0.93)} 100%{transform:scale(1)} }
        @keyframes arShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px)} 40%{transform:translateX(10px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
        @keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0.2} }
        @keyframes popInBig { 0%{transform:scale(0.5);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes popIn { 0%{transform:scale(0);opacity:0} 100%{transform:scale(1);opacity:1} }
      `}</style>
    </div>
  );
}
