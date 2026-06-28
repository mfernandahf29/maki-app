"use client";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function ARPage() {
  const [currentView, setCurrentView] = useState("preparation"); // "preparation", "camera", "fallback"
  const [isDetected, setIsDetected] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const concepts = [
    { id: 1, emoji: "🍎", name: "Manzana" },
    { id: 2, emoji: "🐶", name: "Perro" },
    { id: 3, emoji: "🚗", name: "Auto" },
    { id: 4, emoji: "🌞", name: "Sol" },
    { id: 5, emoji: "📚", name: "Libro" },
    { id: 6, emoji: "🎸", name: "Guitarra" },
    { id: 7, emoji: "💧", name: "Agua" },
    { id: 8, emoji: "🌳", name: "Árbol" },
    { id: 9, emoji: "🏠", name: "Casa" },
  ];

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen relative overflow-x-hidden">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-16 h-20 bg-surface/90 backdrop-blur-sm border-b border-surface-variant">
        <div className="flex items-center gap-4">
          <Link href="/estudiante/menu">
            <button className="text-primary hover:bg-surface-variant p-2 rounded-full transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">arrow_back</span>
            </button>
          </Link>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">
            Módulo AR
          </h1>
        </div>
        <div className="font-display-logo text-[32px] text-primary tracking-widest opacity-50">
          MAKI
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-24 pb-24 px-4 md:px-16 max-w-7xl mx-auto min-h-[calc(100vh-80px)] flex flex-col">
        {/* View 1: Preparation */}
        {currentView === "preparation" && (
          <div className="flex-1 flex flex-col items-center justify-center animate-[slideUp_0.5s_ease-out_forwards]">
            <div className="text-center mb-12">
              <h2 className="font-headline-lg text-[36px] text-primary mb-4">
                ¡Magia en tus manos!
              </h2>
              <p className="font-body-lg text-[20px] text-on-surface-variant max-w-2xl mx-auto">
                Sigue estos pasos para dar vida a las tarjetas de aprendizaje.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 w-full max-w-4xl">
              {/* Step 1 */}
              <div className="bg-surface-container-lowest border-2 border-primary-fixed rounded-xl p-8 shadow-sm flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-md">
                <div className="bg-primary-container w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-floating">
                  <span
                    className="material-symbols-outlined text-[40px] text-on-primary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    print
                  </span>
                </div>
                <h3 className="font-body-xl text-[24px] text-primary mb-2">Paso 1</h3>
                <p className="text-on-surface-variant mb-4">
                  Imprime las tarjetas mágicas desde la sección de recursos.
                </p>
                <button
                  className="mt-auto text-primary font-bold underline hover:text-primary-container transition-colors"
                  onClick={() => window.print()}
                >
                  Imprimir Tarjetas
                </button>
              </div>
              {/* Step 2 */}
              <div className="bg-surface-container-lowest border-2 border-primary-fixed rounded-xl p-8 shadow-sm flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-md">
                <div
                  className="bg-secondary-container w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-floating"
                  style={{ animationDelay: "0.2s" }}
                >
                  <span
                    className="material-symbols-outlined text-[40px] text-on-secondary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    cut
                  </span>
                </div>
                <h3 className="font-body-xl text-[24px] text-secondary mb-2">Paso 2</h3>
                <p className="text-on-surface-variant">
                  Recorta cada tarjeta con cuidado por las líneas punteadas.
                </p>
              </div>
              {/* Step 3 */}
              <div className="bg-surface-container-lowest border-2 border-primary-fixed rounded-xl p-8 shadow-sm flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-md">
                <div
                  className="bg-tertiary-container w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-floating"
                  style={{ animationDelay: "0.4s" }}
                >
                  <span
                    className="material-symbols-outlined text-[40px] text-on-tertiary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    center_focus_strong
                  </span>
                </div>
                <h3 className="font-body-xl text-[24px] text-tertiary mb-2">Paso 3</h3>
                <p className="text-on-surface-variant">
                  Apunta la cámara de tu dispositivo hacia la tarjeta.
                </p>
              </div>
            </div>
            
            <button
              className="bg-secondary-container text-on-secondary-container border-b-4 border-secondary rounded-xl px-12 py-4 shadow-md transition-transform hover:-translate-y-1 active:translate-y-0 active:border-b-0 font-headline-md text-[28px] flex items-center gap-4"
              onClick={() => setCurrentView("camera")}
            >
              <span className="material-symbols-outlined text-[32px]">photo_camera</span>
              📷 ACTIVAR CÁMARA AR
            </button>
            <button
              className="mt-6 text-on-surface-variant underline hover:text-primary transition-colors"
              onClick={() => setCurrentView("fallback")}
            >
              Modo sin cámara (Alternativa)
            </button>
          </div>
        )}

        {/* View 2: Camera Mode UI */}
        {currentView === "camera" && (
          <div className="flex-1 flex flex-col relative bg-on-background overflow-hidden rounded-2xl animate-pop-in">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-50"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC5MMBqkHMZTXqF30S_2n5f4eNJ47PgUCw0ryAQ6Nmn7sL1qe9wJ9MhXBTjUgOoePoQGz_-8ahtiD-zwWLwoea22TrYPifj-Zv-V9ax3wfqhlDzVv-elaRXITStUgk6pulGfW_hkZw6A7q_qHEZXzSt_CUnokln_WRaVtIqxjLjNjEDXp0E4jZeDJiz-XMEMVEx4ZmV5dsbH9DIYA4paqtNWK9uhZBaN_Z-d-csMX9rir8hBOMiYT6DVOLEQR6MHqg-R1RcLovSgJY')",
              }}
            ></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
              <div
                className="w-64 h-64 md:w-96 md:h-96 relative flex items-center justify-center"
                style={{
                  background: `
                    linear-gradient(to right, #006782 4px, transparent 4px) 0 0,
                    linear-gradient(to right, #006782 4px, transparent 4px) 0 100%,
                    linear-gradient(to left, #006782 4px, transparent 4px) 100% 0,
                    linear-gradient(to left, #006782 4px, transparent 4px) 100% 100%,
                    linear-gradient(to bottom, #006782 4px, transparent 4px) 0 0,
                    linear-gradient(to bottom, #006782 4px, transparent 4px) 100% 0,
                    linear-gradient(to top, #006782 4px, transparent 4px) 0 100%,
                    linear-gradient(to top, #006782 4px, transparent 4px) 100% 100%
                  `,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "40px 40px",
                }}
              >
                {!isDetected && (
                  <div className="absolute -top-12 bg-surface-container/80 backdrop-blur-sm px-6 py-2 rounded-full border border-surface-variant shadow-sm pointer-events-auto">
                    <p className="font-body-lg text-[20px] text-on-surface animate-bounce">
                      Apunta la tarjeta aquí
                    </p>
                  </div>
                )}
                {!isDetected && (
                  <button
                    className="w-32 h-32 rounded-full border-2 border-dashed border-primary/50 hover:bg-primary/10 pointer-events-auto transition-colors flex items-center justify-center group"
                    onClick={() => setIsDetected(true)}
                  >
                    <span className="opacity-0 group-hover:opacity-100 text-xs text-primary bg-surface/80 px-2 rounded">
                      Click para simular
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Detected State Overlay */}
            {isDetected && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none bg-on-background/20 backdrop-blur-sm">
                <div
                  className="text-[120px] mb-6 drop-shadow-2xl animate-[arExplode_1s_ease-in-out_forwards] pointer-events-auto"
                  style={{ filter: "drop-shadow(0 20px 13px rgba(0,0,0,0.3))" }}
                >
                  🍎
                </div>
                <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-xl border-4 border-primary-container flex flex-col items-center animate-pop-in pointer-events-auto mt-4 max-w-sm text-center">
                  <h3 className="font-headline-lg text-[36px] text-primary mb-2">Manzana</h3>
                  <p className="font-body-md text-on-surface-variant mb-6">
                    Fruta deliciosa y saludable, de color rojo o verde.
                  </p>
                  <button
                    className="bg-secondary-container text-on-secondary-container border-b-4 border-secondary rounded-xl px-8 py-3 shadow-md transition-transform hover:-translate-y-1 active:translate-y-0 active:border-b-0 w-full flex items-center justify-center gap-2 font-bold"
                    onClick={() => setIsDetected(false)}
                  >
                    <span className="material-symbols-outlined">star</span>
                    ✅ ¡Lo aprendí! (+1⭐)
                  </button>
                </div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 w-full p-8 flex justify-center z-30 pointer-events-auto bg-gradient-to-t from-black/50 to-transparent">
              <button
                className="bg-error text-on-error border-b-4 border-on-error-container rounded-xl px-8 py-3 shadow-md transition-transform hover:-translate-y-1 active:translate-y-0 active:border-b-0 flex items-center gap-2 font-bold"
                onClick={() => {
                  setIsDetected(false);
                  setCurrentView("preparation");
                }}
              >
                <span className="material-symbols-outlined">close</span>
                Cerrar Cámara
              </button>
            </div>
          </div>
        )}

        {/* View 3: Fallback Mode */}
        {currentView === "fallback" && (
          <div className="flex-1 flex flex-col animate-[slideUp_0.5s_ease-out_forwards] h-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-headline-md text-[28px] text-primary">
                Explorar Conceptos
              </h2>
              <button
                className="text-on-surface-variant hover:bg-surface-variant px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                onClick={() => setCurrentView("preparation")}
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Volver
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-1 overflow-y-auto pb-8 pr-2">
              {concepts.map((concept) => {
                const isActive = activeCard === concept.id;
                return (
                  <div
                    key={concept.id}
                    onClick={() => setActiveCard(isActive ? null : concept.id)}
                    className={`cursor-pointer flex flex-col items-center justify-center aspect-square transition-all duration-300 ${
                      isActive
                        ? "scale-[1.5] z-50 shadow-[0_0_30px_rgba(41,171,212,0.6)] bg-white relative rounded-xl"
                        : "bg-surface-container-lowest border-2 border-primary-fixed rounded-xl p-8 shadow-sm hover:-translate-y-1 hover:shadow-md"
                    }`}
                  >
                    <div className="text-[64px] mb-4 transition-transform duration-300 group-hover:scale-110">
                      {concept.emoji}
                    </div>
                    <h3 className="font-body-lg text-[20px] text-primary text-center">
                      {concept.name}
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Printable Cards Section (Hidden) */}
      <div className="hidden print:grid print:grid-cols-3 print:gap-4 print:absolute print:inset-0 w-full bg-white text-black p-4">
        {Array.from({ length: 36 }).map((_, i) => (
          <div
            key={i}
            className="border-2 border-black p-4 text-center break-inside-avoid"
          >
            <div className="w-[100px] h-[100px] border-4 border-black mx-auto mb-4 flex items-center justify-center">
              <div className="w-[50px] h-[50px] bg-black"></div>
            </div>
            <h2 className="font-sans text-[24px]">
              {concepts[i % concepts.length].name}
            </h2>
            <p className="font-sans text-[12px] text-gray-600">
              Tarjeta MAKI AR #{i + 1}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
