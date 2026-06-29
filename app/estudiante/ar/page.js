"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const OBJETOS = [
  { emoji: "🍎", nombre: "Manzana",  desc: "Fruta dulce y crujiente, rica en vitaminas." },
  { emoji: "🐶", nombre: "Perro",    desc: "Animal doméstico fiel y cariñoso." },
  { emoji: "🚗", nombre: "Auto",     desc: "Vehículo de cuatro ruedas para transportarse." },
  { emoji: "☀️", nombre: "Sol",      desc: "Estrella que nos da luz y calor cada día." },
  { emoji: "📚", nombre: "Libro",    desc: "Con cada libro aprendemos cosas nuevas." },
  { emoji: "🎸", nombre: "Guitarra", desc: "Instrumento musical de cuerdas." },
  { emoji: "💧", nombre: "Agua",     desc: "Líquido esencial para toda vida en la Tierra." },
  { emoji: "🌳", nombre: "Árbol",    desc: "Planta que da sombra y produce oxígeno." },
  { emoji: "🏠", nombre: "Casa",     desc: "Lugar donde vivimos con nuestra familia." },
];

export default function ARPage() {
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [deteccion, setDeteccion] = useState(null); // objeto detectado actualmente
  const [aprendidas, setAprendidas] = useState(0);

  const videoRef  = useRef(null);
  const streamRef = useRef(null);
  const timerRef  = useRef(null);
  const detTimerRef = useRef(null);

  // ── Activar cámara ──────────────────────────────────────────────────────────
  const activarCamara = async () => {
    setError("");
    setCargando(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;

      // El elemento <video> ya está en el DOM — asignamos directamente
      const vid = videoRef.current;
      vid.srcObject = stream;
      await vid.play();

      setCamaraActiva(true);

      // Detección simulada cada 3 segundos
      timerRef.current = setInterval(() => {
        const obj = OBJETOS[Math.floor(Math.random() * OBJETOS.length)];
        setDeteccion(obj);
        // Ocultar después de 2.5 s
        clearTimeout(detTimerRef.current);
        detTimerRef.current = setTimeout(() => setDeteccion(null), 2500);
      }, 3000);

    } catch (err) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Permiso denegado. Activa la cámara en Ajustes → Permisos del navegador.");
      } else if (err.name === "NotFoundError") {
        setError("No se encontró cámara en este dispositivo.");
      } else {
        setError("Error al abrir la cámara: " + err.message);
      }
    } finally {
      setCargando(false);
    }
  };

  // ── Cerrar cámara ──────────────────────────────────────────────────────────
  const cerrarCamara = () => {
    clearInterval(timerRef.current);
    clearTimeout(detTimerRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamaraActiva(false);
    setDeteccion(null);
  };

  const aprendi = () => {
    setAprendidas(n => n + 1);
    clearTimeout(detTimerRef.current);
    setDeteccion(null);
  };

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(detTimerRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  return (
    <div style={{ minHeight: "100svh", background: "#000", color: "#fff", fontFamily: "sans-serif", overflowX: "hidden" }}>

      {/* ── VIDEO — siempre en el DOM para que videoRef.current sea válido ── */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: camaraActiva ? "block" : "none",
          zIndex: 1,
        }}
      />

      {/* ═══════════════════════════════════════
          PANTALLA DE INICIO (sin cámara)
      ═══════════════════════════════════════ */}
      {!camaraActiva && (
        <div style={{
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          gap: "24px",
          background: "linear-gradient(160deg, #0f172a, #1e3a5f)",
        }}>
          {/* Volver */}
          <Link href="/estudiante/menu" style={{
            position: "absolute", top: 16, left: 16,
            color: "#7dd3fc", textDecoration: "none", fontSize: 14,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
            Volver
          </Link>

          <div style={{ textAlign: "center", maxWidth: 360 }}>
            <div style={{ fontSize: 72, marginBottom: 12 }}>🪄</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 8px", color: "#7dd3fc" }}>
              Módulo AR
            </h1>
            <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>
              Apunta la cámara a las tarjetas impresas y descubre los objetos con realidad aumentada.
            </p>
          </div>

          {/* Objetos disponibles */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8, width: "100%", maxWidth: 320,
          }}>
            {OBJETOS.map(o => (
              <div key={o.nombre} style={{
                background: "rgba(255,255,255,0.07)", borderRadius: 12,
                padding: "10px 4px", textAlign: "center",
                border: "1px solid rgba(255,255,255,0.1)",
              }}>
                <div style={{ fontSize: 32 }}>{o.emoji}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{o.nombre}</div>
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "#450a0a", border: "1px solid #dc2626",
              borderRadius: 12, padding: "12px 16px",
              fontSize: 14, color: "#fca5a5", maxWidth: 340, textAlign: "center",
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Botón principal */}
          <button
            onClick={activarCamara}
            disabled={cargando}
            style={{
              background: cargando ? "#1e40af" : "#2563eb",
              color: "#fff", border: "none",
              borderRadius: 20, padding: "18px 40px",
              fontSize: 20, fontWeight: 900, cursor: cargando ? "not-allowed" : "pointer",
              boxShadow: "0 6px 0 #1e3a8a",
              display: "flex", alignItems: "center", gap: 10,
              transition: "transform 0.1s",
            }}
            onMouseDown={e => e.currentTarget.style.transform = "translateY(4px)"}
            onMouseUp={e => e.currentTarget.style.transform = ""}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 28, fontVariationSettings: "'FILL' 1" }}>
              {cargando ? "progress_activity" : "photo_camera"}
            </span>
            {cargando ? "Activando cámara..." : "ACTIVAR CÁMARA AR"}
          </button>

          <p style={{ fontSize: 12, color: "#475569", textAlign: "center", maxWidth: 280 }}>
            El navegador pedirá permiso para usar la cámara. Acepta para continuar.
          </p>
        </div>
      )}

      {/* ═══════════════════════════════════════
          OVERLAY AR (encima del video real)
      ═══════════════════════════════════════ */}
      {camaraActiva && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 10,
          display: "flex", flexDirection: "column",
          pointerEvents: "none",
        }}>
          {/* Barra superior */}
          <div style={{
            pointerEvents: "auto",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 16px",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
          }}>
            <button onClick={cerrarCamara} style={{
              background: "rgba(0,0,0,0.5)", color: "#fff", border: "none",
              borderRadius: "50%", width: 44, height: 44, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24 }}>close</span>
            </button>

            <div style={{
              background: "rgba(0,0,0,0.5)", color: "#fff",
              borderRadius: 20, padding: "6px 14px", fontSize: 14, fontWeight: 700,
            }}>
              ⭐ {aprendidas} aprendidas
            </div>
          </div>

          {/* Marco de detección centrado */}
          {!deteccion && (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 16,
            }}>
              {/* Reticle */}
              <div style={{ position: "relative", width: 200, height: 200 }}>
                {/* Esquinas */}
                {[
                  { top: 0, left: 0, borderTop: "4px solid #fff", borderLeft: "4px solid #fff" },
                  { top: 0, right: 0, borderTop: "4px solid #fff", borderRight: "4px solid #fff" },
                  { bottom: 0, left: 0, borderBottom: "4px solid #fff", borderLeft: "4px solid #fff" },
                  { bottom: 0, right: 0, borderBottom: "4px solid #fff", borderRight: "4px solid #fff" },
                ].map((style, i) => (
                  <div key={i} style={{
                    position: "absolute", width: 40, height: 40,
                    borderRadius: 2, ...style,
                  }} />
                ))}
                <div style={{ textAlign: "center", color: "#fff", fontSize: 13, opacity: 0.85 }}>
                  <div style={{ fontSize: 28, marginBottom: 4, animation: "pulse 2s infinite" }}>📡</div>
                  Buscando tarjeta...
                </div>
              </div>
            </div>
          )}

          {/* ── Objeto detectado ── */}
          {deteccion && (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              pointerEvents: "auto",
            }}>
              {/* Emoji flotante */}
              <div style={{
                fontSize: 120, lineHeight: 1, marginBottom: 16,
                filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.7))",
                animation: "flotar 1.2s ease-in-out infinite alternate",
              }}>
                {deteccion.emoji}
              </div>

              {/* Card informativa */}
              <div style={{
                background: "rgba(255,255,255,0.97)",
                borderRadius: 24, padding: "20px 24px",
                width: "calc(100% - 48px)", maxWidth: 340,
                textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}>
                <h2 style={{ fontSize: 28, fontWeight: 900, color: "#1e293b", margin: "0 0 6px" }}>
                  {deteccion.nombre}
                </h2>
                <p style={{ fontSize: 15, color: "#64748b", margin: "0 0 16px", lineHeight: 1.5 }}>
                  {deteccion.desc}
                </p>
                <button onClick={aprendi} style={{
                  width: "100%", padding: "14px", borderRadius: 16,
                  background: "#16a34a", color: "#fff", border: "none",
                  fontSize: 18, fontWeight: 900, cursor: "pointer",
                  boxShadow: "0 4px 0 #15803d",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ¡Lo aprendí! +1⭐
                </button>
              </div>
            </div>
          )}

          {/* Barra inferior */}
          <div style={{
            padding: "16px", textAlign: "center",
            background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
          }}>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: 0 }}>
              {deteccion ? "¡Tarjeta detectada!" : "Apunta la cámara hacia una tarjeta impresa"}
            </p>
          </div>
        </div>
      )}

      {/* Animaciones */}
      <style>{`
        @keyframes flotar {
          from { transform: translateY(0) scale(1); }
          to   { transform: translateY(-18px) scale(1.06); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
