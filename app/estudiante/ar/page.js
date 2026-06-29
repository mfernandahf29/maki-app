"use client";
// AR con cámara real + detección por color (Canvas API).
// mind-ar / three instalados — para activar imagen tracking completo se requieren
// archivos .mind pre-compilados desde https://hiukim.github.io/mind-ar-js-doc/tools/compile

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// ── Tarjetas con color de fondo único para detectar ───────────────────────────
// Cada tarjeta imprimible tiene ese color como fondo sólido.
const TARJETAS = [
  {
    id: "manzana", emoji: "🍎", nombre: "Manzana",
    desc: "Fruta dulce y crujiente. Rica en vitaminas y fibra.",
    bgCard: "#EF4444", hueMin: 350, hueMax: 10,   // Rojo (envuelve alrededor de 0)
  },
  {
    id: "perro", emoji: "🐶", nombre: "Perro",
    desc: "Animal doméstico fiel y cariñoso. El mejor amigo del ser humano.",
    bgCard: "#F97316", hueMin: 25, hueMax: 45,    // Naranja
  },
  {
    id: "sol", emoji: "☀️", nombre: "Sol",
    desc: "Estrella que nos da luz y calor. Hace crecer las plantas.",
    bgCard: "#EAB308", hueMin: 50, hueMax: 68,    // Amarillo
  },
  {
    id: "libro", emoji: "📚", nombre: "Libro",
    desc: "Con cada libro aprendemos cosas nuevas y viajamos a otros mundos.",
    bgCard: "#84CC16", hueMin: 83, hueMax: 108,   // Lima
  },
  {
    id: "arbol", emoji: "🌳", nombre: "Árbol",
    desc: "Planta grande que da sombra y produce el oxígeno que respiramos.",
    bgCard: "#16A34A", hueMin: 120, hueMax: 152,  // Verde bosque
  },
  {
    id: "agua", emoji: "💧", nombre: "Agua",
    desc: "Líquido esencial para toda vida. Cubre el 70% de la Tierra.",
    bgCard: "#06B6D4", hueMin: 178, hueMax: 202,  // Cian
  },
  {
    id: "auto", emoji: "🚗", nombre: "Auto",
    desc: "Vehículo con cuatro ruedas que nos lleva de un lugar a otro.",
    bgCard: "#3B82F6", hueMin: 212, hueMax: 248,  // Azul
  },
  {
    id: "guitarra", emoji: "🎸", nombre: "Guitarra",
    desc: "Instrumento musical de cuerdas. Con ella se crean bellas melodías.",
    bgCard: "#A855F7", hueMin: 265, hueMax: 292,  // Violeta
  },
  {
    id: "casa", emoji: "🏠", nombre: "Casa",
    desc: "Lugar donde vivimos con nuestra familia. Nuestro hogar.",
    bgCard: "#EC4899", hueMin: 312, hueMax: 342,  // Rosa
  },
];

// ── Algoritmo de detección ─────────────────────────────────────────────────────
function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0, s = max === 0 ? 0 : d / max;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h * 360, s * 100, max * 100];
}

function hueEnRango(h, min, max) {
  return max >= min ? (h >= min && h <= max) : (h >= min || h <= max);
}

function detectarColor(videoEl, canvas, ctx) {
  if (!videoEl || videoEl.readyState < 2 || videoEl.paused) return null;
  const vw = videoEl.videoWidth, vh = videoEl.videoHeight;
  if (!vw || !vh) return null;

  // Samplear un ROI de 80×80 en el centro del frame
  const roi = 80;
  const sx = Math.floor((vw - roi) / 2), sy = Math.floor((vh - roi) / 2);
  canvas.width = roi;
  canvas.height = roi;
  ctx.drawImage(videoEl, sx, sy, roi, roi, 0, 0, roi, roi);
  const { data } = ctx.getImageData(0, 0, roi, roi);

  const counts = new Array(TARJETAS.length).fill(0);
  let validPx = 0;

  for (let i = 0; i < data.length; i += 4) {
    const [h, s, v] = rgbToHsv(data[i], data[i + 1], data[i + 2]);
    if (s < 38 || v < 22) continue; // ignorar píxeles grises/oscuros
    validPx++;
    for (let j = 0; j < TARJETAS.length; j++) {
      if (hueEnRango(h, TARJETAS[j].hueMin, TARJETAS[j].hueMax)) counts[j]++;
    }
  }

  if (validPx < 60) return null; // pocas muestras válidas

  let best = -1, bestN = 0;
  for (let j = 0; j < counts.length; j++) {
    if (counts[j] > bestN) { bestN = counts[j]; best = j; }
  }

  return (best >= 0 && bestN / validPx > 0.28) ? TARJETAS[best] : null;
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function ARPage() {
  const [vista, setVista] = useState("prep"); // prep | camara | galeria
  const [tarjeta, setTarjeta] = useState(null); // tarjeta detectada actualmente
  const [aprendidas, setAprendidas] = useState(new Set());
  const [camaraError, setCamaraError] = useState("");
  const [facingMode, setFacingMode] = useState("environment");
  const [cargando, setCargando] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const rafRef = useRef(null);
  const tarjetaRef = useRef(null); // ref para evitar closure stale
  const cooldownRef = useRef(0);
  const consecutivoRef = useRef({ id: null, n: 0 });

  // Iniciar cámara
  const iniciarCamara = useCallback(async (facing) => {
    setCamaraError("");
    setCargando(true);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => videoRef.current?.play();
      }
      // Setup detection canvas
      canvasRef.current = document.createElement("canvas");
      ctxRef.current = canvasRef.current.getContext("2d", { willReadFrequently: true });
      setVista("camara");
      tarjetaRef.current = null;
      cooldownRef.current = 0;
      consecutivoRef.current = { id: null, n: 0 };
    } catch (err) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCamaraError("Permiso de cámara denegado. Permite el acceso en la configuración del navegador.");
      } else if (err.name === "NotFoundError") {
        setCamaraError("No se encontró cámara en este dispositivo.");
      } else {
        setCamaraError("No se pudo abrir la cámara: " + err.message);
      }
    } finally {
      setCargando(false);
    }
  }, []);

  // Detener cámara
  const detenerCamara = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    tarjetaRef.current = null;
    setTarjeta(null);
    setVista("prep");
  }, []);

  // Loop de detección (solo cuando vista === "camara")
  useEffect(() => {
    if (vista !== "camara") return;

    let frame = 0;
    const loop = () => {
      frame++;
      if (frame % 8 === 0 && !tarjetaRef.current && cooldownRef.current <= 0) {
        const found = detectarColor(videoRef.current, canvasRef.current, ctxRef.current);
        const foundId = found?.id || null;
        const cons = consecutivoRef.current;

        if (foundId && foundId === cons.id) {
          cons.n++;
          if (cons.n >= 4) { // 4 detecciones consecutivas → confirmar
            tarjetaRef.current = found;
            setTarjeta(found);
            consecutivoRef.current = { id: null, n: 0 };
          }
        } else {
          consecutivoRef.current = { id: foundId, n: foundId ? 1 : 0 };
        }
      }
      if (cooldownRef.current > 0) cooldownRef.current--;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    };
  }, [vista]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  const marcarAprendida = () => {
    if (tarjetaRef.current) {
      setAprendidas(prev => new Set([...prev, tarjetaRef.current.id]));
    }
    tarjetaRef.current = null;
    setTarjeta(null);
    cooldownRef.current = 90; // ~3s de cooldown
  };

  const descartarTarjeta = () => {
    tarjetaRef.current = null;
    setTarjeta(null);
    cooldownRef.current = 60; // ~2s de cooldown
  };

  const flipCamara = () => {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    iniciarCamara(next);
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col overflow-hidden">

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-surface/95 backdrop-blur-sm border-b border-surface-variant">
        <div className="flex items-center gap-3">
          {vista === "camara" ? (
            <button onClick={detenerCamara} className="text-primary hover:bg-surface-variant p-2 rounded-full transition-colors">
              <span className="material-symbols-outlined text-[28px]">close</span>
            </button>
          ) : (
            <Link href="/estudiante/menu">
              <button className="text-primary hover:bg-surface-variant p-2 rounded-full transition-colors">
                <span className="material-symbols-outlined text-[28px]">arrow_back</span>
              </button>
            </Link>
          )}
          <h1 className="font-bold text-[20px] text-primary">
            {vista === "camara" ? "Cámara AR" : "Módulo AR"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {aprendidas.size > 0 && (
            <span className="bg-secondary-container text-on-secondary-container text-sm px-3 py-1 rounded-full font-bold">
              ⭐ {aprendidas.size}/{TARJETAS.length}
            </span>
          )}
          <span className="font-display-logo text-[22px] text-primary tracking-widest opacity-40">MAKI</span>
        </div>
      </header>

      {/* ═══════════════════════════════════════
          VISTA: PREPARACIÓN
      ═══════════════════════════════════════ */}
      {vista === "prep" && (
        <main className="flex-1 pt-20 pb-8 px-4 md:px-8 max-w-4xl mx-auto w-full">
          <div className="text-center mb-8 mt-4">
            <h2 className="text-[30px] font-black text-primary mb-2">¡Tarjetas Mágicas!</h2>
            <p className="text-on-surface-variant text-[16px]">
              Imprime las tarjetas de colores, apunta la cámara y ¡dales vida!
            </p>
          </div>

          {/* Instrucciones */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { n: 1, icon: "print", color: "bg-primary-container", fg: "text-on-primary-container", text: "Imprime las tarjetas de colores de abajo" },
              { n: 2, icon: "content_cut", color: "bg-secondary-container", fg: "text-on-secondary-container", text: "Recorta cada tarjeta por la línea punteada" },
              { n: 3, icon: "center_focus_strong", color: "bg-tertiary-container", fg: "text-on-tertiary-container", text: "Apunta la cámara al cuadro central de la tarjeta" },
            ].map(s => (
              <div key={s.n} className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-4 text-center flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${s.color}`}>
                  <span className={`material-symbols-outlined text-[22px] ${s.fg}`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                </div>
                <span className="text-xs text-on-surface-variant leading-tight">{s.text}</span>
              </div>
            ))}
          </div>

          {/* Error de cámara */}
          {camaraError && (
            <div className="bg-error-container border border-error/30 rounded-xl px-4 py-3 mb-6 text-on-error-container text-sm flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] mt-0.5 flex-shrink-0">error</span>
              {camaraError}
            </div>
          )}

          {/* Botón principal */}
          <div className="flex flex-col items-center gap-4 mb-10">
            <button
              onClick={() => iniciarCamara(facingMode)}
              disabled={cargando}
              className="bg-primary text-white rounded-2xl px-10 py-4 text-[22px] font-black shadow-[0_6px_0_#004d63] hover:-translate-y-1 hover:shadow-[0_8px_0_#004d63] active:translate-y-1 active:shadow-none transition-all flex items-center gap-3 disabled:opacity-60"
            >
              {cargando
                ? <><span className="material-symbols-outlined text-[28px] animate-spin">progress_activity</span> Activando...</>
                : <><span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span> ACTIVAR CÁMARA AR</>
              }
            </button>
            <button onClick={() => setVista("galeria")} className="text-primary text-sm underline underline-offset-2 hover:opacity-70">
              Explorar sin cámara
            </button>
          </div>

          {/* Tarjetas imprimibles */}
          <div className="border-t-2 border-outline-variant pt-6">
            <h3 className="font-bold text-[18px] text-on-surface mb-1">Tarjetas para imprimir</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Imprime esta página y recorta cada tarjeta. La cámara detecta el color de fondo.
            </p>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {TARJETAS.map(t => (
                <div key={t.id} className="rounded-2xl overflow-hidden border-2 border-outline-variant shadow-sm print:break-inside-avoid">
                  <div className="flex flex-col items-center justify-center py-4 px-2"
                    style={{ backgroundColor: t.bgCard }}>
                    <span style={{ fontSize: 44, lineHeight: 1 }}>{t.emoji}</span>
                  </div>
                  <div className="bg-white text-center py-1.5 px-1">
                    <p className="font-bold text-[13px] text-gray-800">{t.nombre}</p>
                    <p className="text-[10px] text-gray-400">MAKI AR</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => window.print()}
              className="mt-4 flex items-center gap-2 bg-surface-container-high text-on-surface px-5 py-2 rounded-full text-sm hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-[18px]">print</span>
              Imprimir tarjetas
            </button>
          </div>
        </main>
      )}

      {/* ═══════════════════════════════════════
          VISTA: CÁMARA AR
      ═══════════════════════════════════════ */}
      {vista === "camara" && (
        <div className="fixed inset-0 bg-black z-40 flex flex-col">
          {/* Header de cámara */}
          <div className="absolute top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-gradient-to-b from-black/70 to-transparent">
            <button onClick={detenerCamara} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
              <span className="material-symbols-outlined text-[28px]">close</span>
            </button>
            <span className="text-white text-sm font-semibold opacity-80">Apunta la tarjeta al recuadro</span>
            <button onClick={flipCamara} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
              <span className="material-symbols-outlined text-[26px]">flip_camera_android</span>
            </button>
          </div>

          {/* Video feed real */}
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
          />

          {/* Reticle overlay */}
          {!tarjeta && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
                {/* Esquinas del reticle */}
                {[
                  "top-0 left-0 border-t-4 border-l-4",
                  "top-0 right-0 border-t-4 border-r-4",
                  "bottom-0 left-0 border-b-4 border-l-4",
                  "bottom-0 right-0 border-b-4 border-r-4",
                ].map((cls, i) => (
                  <div key={i} className={`absolute w-12 h-12 border-white rounded-sm ${cls}`} />
                ))}
                <div className="text-center">
                  <p className="text-white text-sm font-semibold drop-shadow-lg animate-pulse">
                    Coloca la tarjeta aquí
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Tarjeta detectada ── */}
          {tarjeta && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
              {/* Fondo semitransparente */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={descartarTarjeta} />

              {/* Emoji flotante */}
              <div className="relative z-10 flex flex-col items-center gap-6 px-6 w-full max-w-sm">
                <div className="text-[110px] leading-none drop-shadow-2xl"
                  style={{ animation: "arFloat 1.5s ease-in-out infinite alternate", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.5))" }}>
                  {tarjeta.emoji}
                </div>

                {/* Info card */}
                <div className="bg-white rounded-3xl shadow-2xl border-4 w-full overflow-hidden"
                  style={{ borderColor: tarjeta.bgCard }}>
                  <div className="py-3 text-center" style={{ backgroundColor: tarjeta.bgCard }}>
                    <p className="text-white font-black text-[28px] drop-shadow">{tarjeta.nombre}</p>
                  </div>
                  <div className="px-6 py-4 text-center">
                    <p className="text-gray-600 text-[15px] leading-relaxed mb-4">{tarjeta.desc}</p>
                    <button onClick={marcarAprendida}
                      className="w-full py-3 rounded-2xl font-black text-[18px] text-white shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                      style={{ backgroundColor: tarjeta.bgCard }}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      ¡Lo aprendí! +1⭐
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Indicador aprendidas */}
          {aprendidas.size > 0 && !tarjeta && (
            <div className="absolute bottom-6 left-0 w-full flex justify-center z-10 pointer-events-none">
              <div className="bg-black/60 text-white px-5 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                ⭐ {aprendidas.size}/{TARJETAS.length} aprendidas
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════
          VISTA: GALERÍA
      ═══════════════════════════════════════ */}
      {vista === "galeria" && (
        <main className="flex-1 pt-20 pb-8 px-4 md:px-8 max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6 mt-2">
            <h2 className="font-black text-[24px] text-primary">Galería de Tarjetas</h2>
            <button onClick={() => setVista("prep")} className="text-on-surface-variant hover:bg-surface-variant px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-colors">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Volver
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {TARJETAS.map(t => {
              const learned = aprendidas.has(t.id);
              return (
                <div key={t.id} className={`rounded-2xl overflow-hidden border-2 transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer ${learned ? "border-green-400" : "border-outline-variant"}`}
                  style={{ boxShadow: learned ? `0 0 0 3px #22c55e33` : undefined }}>
                  <div className="flex flex-col items-center justify-center py-5 relative"
                    style={{ backgroundColor: t.bgCard }}>
                    <span style={{ fontSize: 52, lineHeight: 1 }}>{t.emoji}</span>
                    {learned && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-[14px] shadow">
                        ⭐
                      </div>
                    )}
                  </div>
                  <div className="bg-surface-container-lowest p-3 text-center">
                    <p className="font-bold text-[15px] text-on-surface">{t.nombre}</p>
                    <p className="text-xs text-on-surface-variant leading-snug mt-1">{t.desc.slice(0, 50)}…</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <button onClick={() => iniciarCamara(facingMode)}
              className="bg-primary text-white rounded-2xl px-8 py-3 font-bold text-[16px] shadow-[0_4px_0_#004d63] hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 mx-auto">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
              Activar cámara AR
            </button>
          </div>
        </main>
      )}

      {/* Animaciones CSS */}
      <style>{`
        @keyframes arFloat {
          from { transform: translateY(0px) scale(1); }
          to   { transform: translateY(-14px) scale(1.05); }
        }
        @media print {
          header, button, .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
