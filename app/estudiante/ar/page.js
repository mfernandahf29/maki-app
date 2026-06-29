"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

const OBJETOS = [
  { emoji: "🍎", nombre: "Manzana",  desc: "Fruta dulce y crujiente, rica en vitaminas." },
  { emoji: "🐶", nombre: "Perro",    desc: "Animal doméstico fiel y cariñoso." },
  { emoji: "🚗", nombre: "Auto",     desc: "Vehículo de cuatro ruedas para transportarse." },
  { emoji: "☀️", nombre: "Sol",      desc: "Estrella que nos da luz y calor cada día." },
  { emoji: "📚", nombre: "Libro",    desc: "Con cada libro aprendemos cosas nuevas." },
  { emoji: "🎸", nombre: "Guitarra", desc: "Instrumento musical de cuerdas." },
  { emoji: "💧", nombre: "Agua",     desc: "Líquido esencial para toda vida." },
  { emoji: "🌳", nombre: "Árbol",    desc: "Planta que da sombra y produce oxígeno." },
  { emoji: "🏠", nombre: "Casa",     desc: "Lugar donde vivimos con nuestra familia." },
];

export default function ARPage() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  const [activa, setActiva] = useState(false);
  const [error, setError] = useState("");
  const [deteccion, setDeteccion] = useState(null);
  const [puntos, setPuntos] = useState(0);

  const activarCamara = () => {
    setError("");
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setActiva(true);
        // Simular detección cada 3 segundos
        intervalRef.current = setInterval(() => {
          const obj = OBJETOS[Math.floor(Math.random() * OBJETOS.length)];
          setDeteccion(obj);
          setTimeout(() => setDeteccion(null), 2500);
        }, 3000);
      })
      .catch(err => setError("No se pudo abrir la cámara: " + err.message));
  };

  const cerrar = () => {
    clearInterval(intervalRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    videoRef.current.srcObject = null;
    setActiva(false);
    setDeteccion(null);
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", overflow: "hidden" }}>

      {/* VIDEO — siempre en el DOM */}
      <video
        ref={videoRef}
        playsInline
        muted
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: activa ? "block" : "none",
        }}
      />

      {/* PANTALLA DE INICIO */}
      {!activa && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 24, padding: 24,
        }}>
          <Link href="/estudiante/menu" style={{
            position: "absolute", top: 20, left: 20,
            color: "#7dd3fc", textDecoration: "none",
            display: "flex", alignItems: "center", gap: 4, fontSize: 14,
          }}>
            ← Volver
          </Link>

          <div style={{ fontSize: 64 }}>🪄</div>
          <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 900, margin: 0, textAlign: "center" }}>
            Módulo AR
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 15, margin: 0, textAlign: "center", maxWidth: 300 }}>
            Apunta la cámara a las tarjetas y descubre los objetos.
          </p>

          {error && (
            <p style={{ color: "#fca5a5", fontSize: 14, textAlign: "center", maxWidth: 320 }}>
              ⚠️ {error}
            </p>
          )}

          <button
            onClick={activarCamara}
            style={{
              background: "#2563eb", color: "#fff",
              border: "none", borderRadius: 16,
              padding: "16px 36px", fontSize: 20,
              fontWeight: 900, cursor: "pointer",
            }}
          >
            📷 ACTIVAR CÁMARA
          </button>
        </div>
      )}

      {/* OVERLAY AR (sobre el video real) */}
      {activa && (
        <div style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none" }}>

          {/* Barra superior */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 16px",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)",
            pointerEvents: "auto",
          }}>
            <button onClick={cerrar} style={{
              background: "rgba(0,0,0,0.5)", color: "#fff",
              border: "none", borderRadius: "50%",
              width: 44, height: 44, cursor: "pointer", fontSize: 20,
            }}>✕</button>
            <span style={{
              background: "rgba(0,0,0,0.5)", color: "#fff",
              borderRadius: 20, padding: "6px 14px", fontSize: 14, fontWeight: 700,
            }}>
              ⭐ {puntos} aprendidas
            </span>
          </div>

          {/* Marco de detección (cuando no hay tarjeta detectada) */}
          {!deteccion && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ position: "relative", width: 200, height: 200 }}>
                {/* Esquinas del marco */}
                {[
                  { top: 0, left: 0, borderTop: "4px solid #fff", borderLeft: "4px solid #fff" },
                  { top: 0, right: 0, borderTop: "4px solid #fff", borderRight: "4px solid #fff" },
                  { bottom: 0, left: 0, borderBottom: "4px solid #fff", borderLeft: "4px solid #fff" },
                  { bottom: 0, right: 0, borderBottom: "4px solid #fff", borderRight: "4px solid #fff" },
                ].map((s, i) => (
                  <div key={i} style={{ position: "absolute", width: 40, height: 40, ...s }} />
                ))}
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(255,255,255,0.8)", fontSize: 13, textAlign: "center",
                }}>
                  Apunta la tarjeta aquí
                </div>
              </div>
            </div>
          )}

          {/* Tarjeta detectada */}
          {deteccion && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              background: "rgba(0,0,0,0.35)",
              pointerEvents: "auto",
            }}>
              <div style={{
                fontSize: 120, lineHeight: 1, marginBottom: 20,
                filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.6))",
                animation: "flotar 1.2s ease-in-out infinite alternate",
              }}>
                {deteccion.emoji}
              </div>

              <div style={{
                background: "#fff", borderRadius: 24,
                padding: "20px 28px", maxWidth: 320, width: "calc(100% - 48px)",
                textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}>
                <h2 style={{ fontSize: 28, fontWeight: 900, color: "#1e293b", margin: "0 0 8px" }}>
                  {deteccion.nombre}
                </h2>
                <p style={{ color: "#64748b", fontSize: 15, margin: "0 0 16px", lineHeight: 1.5 }}>
                  {deteccion.desc}
                </p>
                <button onClick={() => { setPuntos(p => p + 1); setDeteccion(null); }} style={{
                  width: "100%", padding: 14, borderRadius: 14,
                  background: "#16a34a", color: "#fff",
                  border: "none", fontSize: 18, fontWeight: 900, cursor: "pointer",
                }}>
                  ⭐ ¡Lo aprendí! +1
                </button>
              </div>
            </div>
          )}

          {/* Instrucción inferior */}
          {!deteccion && (
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              padding: "16px", textAlign: "center",
              background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
            }}>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, margin: 0 }}>
                La cámara está activa — esperando tarjeta...
              </p>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes flotar {
          from { transform: translateY(0); }
          to   { transform: translateY(-16px); }
        }
      `}</style>
    </div>
  );
}
