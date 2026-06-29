"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function StudentMenu() {
  const [usuario, setUsuario]           = useState(null);
  const [progresoData, setProgresoData] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    const datos = localStorage.getItem("maki_user");
    if (datos) {
      const user = JSON.parse(datos);
      setUsuario(user);
      fetchProgreso(user.id);
    } else {
      setLoadingProgress(false);
    }
  }, []);

  const fetchProgreso = async (userId) => {
    console.log("[MAKI] fetchProgreso para userId:", userId);
    try {
      const result = await supabase
        .from("progreso")
        .select("curso, progreso")
        .eq("usuario_id", userId);
      console.log("[MAKI] fetchProgreso resultado →", result);
      if (result.data) {
        const map = {};
        result.data.forEach((row) => { map[row.curso] = row.progreso; });
        setProgresoData(map);
      }
    } catch (err) {
      console.error("[MAKI] fetchProgreso ERROR →", err);
    }
    setLoadingProgress(false);
  };

  const nombre = usuario?.nombre || usuario?.email?.split("@")[0] || "Estudiante";

  const pct = (key) => loadingProgress ? null : (progresoData[key] ?? 0);
  const pctLabel = (key) => pct(key) === null ? "..." : `${pct(key)}%`;
  const pctWidth = (key) => pct(key) === null ? "0%" : `${pct(key)}%`;

  return (
    <div className="bg-surface text-on-surface min-h-screen pt-20 pb-24 md:pb-0 font-body-md">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-16 h-20 bg-surface shadow-sm">
        <Link href="/">
          <span className="font-display-logo text-[32px] text-primary tracking-widest">MAKI</span>
        </Link>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full font-body-lg text-primary">
            <span className="material-symbols-outlined text-[#feb246]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span>{usuario?.puntos ?? 0}</span>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-tertiary-container px-4 py-2 rounded-full font-body-lg text-on-tertiary-container">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
            <span>Nivel {usuario?.nivel ?? 1}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-primary bg-primary-container flex items-center justify-center">
              <span className="text-xl select-none">🦊</span>
            </div>
            <span className="font-headline-md text-headline-md font-bold text-primary hidden md:block">
              Hola, {nombre}!
            </span>
          </div>
          <Link href="/">
            <button aria-label="Logout" className="text-on-surface-variant hover:scale-105 active:scale-95 transition-transform duration-200 p-2">
              <span className="material-symbols-outlined">logout</span>
            </button>
          </Link>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 md:px-16 py-12">
        {/* Hero */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 md:order-1 space-y-6 animate-pop-in">
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-background leading-tight">
              ¿Qué quieres aprender hoy?
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Elige una aventura para ganar más estrellas.
            </p>
          </div>
          <div className="order-1 md:order-2 flex justify-center md:justify-end items-center h-48 md:h-64">
            <div className="w-40 h-40 md:w-56 md:h-56 bg-secondary-container rounded-full flex items-center justify-center animate-floating shadow-[0_10px_30px_rgba(254,178,70,0.3)] border-4 border-white relative">
              <span className="text-6xl md:text-8xl animate-bounce select-none">🦊</span>
              <span className="absolute -top-4 -right-4 text-3xl animate-pulse">✨</span>
              <span className="absolute top-1/2 -left-6 text-2xl animate-pulse" style={{ animationDelay: "0.5s" }}>🌟</span>
            </div>
          </div>
        </section>

        {/* AR Banner */}
        <section className="mb-16 animate-pop-in" style={{ animationDelay: "0.1s" }}>
          <div className="w-full rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-primary-container to-tertiary-container shadow-[0_8px_24px_rgba(132,43,210,0.2)] text-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-secondary-container opacity-20 rounded-full blur-xl" />
            <div className="flex items-center gap-6 z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                <span className="material-symbols-outlined text-4xl">view_in_ar</span>
              </div>
              <div>
                <h2 className="font-headline-md text-headline-md font-bold text-white flex items-center gap-2">
                  Explorar con Realidad Aumentada <span className="animate-pulse">✨</span>
                </h2>
                <p className="font-body-md text-body-md text-white/90">Descubre animales y números en tu habitación.</p>
              </div>
            </div>
            <Link href="/estudiante/ar" className="z-10 w-full md:w-auto">
              <button className="w-full md:w-auto shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none bg-white text-tertiary font-body-lg text-body-lg px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                <span className="material-symbols-outlined">photo_camera</span>
                ¡Apunta la cámara!
              </button>
            </Link>
          </div>
        </section>

        {/* Course Grid — 4 cards */}
        <section>
          <h2 className="font-headline-md text-headline-md font-bold text-primary mb-8">Tus Aventuras</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

            {/* ── Matemáticas Mágicas ── */}
            <article className="bg-white rounded-[2rem] overflow-hidden flex flex-col group animate-pop-in shadow-lg hover:-translate-y-2 hover:shadow-[0_20px_48px_rgba(254,178,70,0.35)] transition-all duration-300"
              style={{ animationDelay: "0.2s", border: "4px solid #feb246" }}>
              {/* Cabecera degradada amarillo/naranja */}
              <div className="relative flex items-center justify-center py-8" style={{ background: "linear-gradient(160deg,#FFF3C4 0%,#FFD740 100%)" }}>
                <span className="text-[6rem] leading-none select-none group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">🔢</span>
                <div className="absolute top-3 right-3 bg-white/80 text-[#7c5200] px-2.5 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm">⭐ +50</div>
              </div>
              {/* Contenido */}
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="text-center">
                  <h3 className="font-headline-md text-[22px] font-bold text-on-background">Matemáticas Mágicas</h3>
                  <p className="font-body-md text-on-surface-variant text-sm mt-1">Aprende a sumar con MAKI.</p>
                </div>
                <div className="w-full space-y-1.5">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-[#b37000]">Progreso</span>
                    <span className="text-[#b37000]">{pctLabel("mate")}</span>
                  </div>
                  <div className="h-3 w-full bg-[#FFF3C4] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: pctWidth("mate"), backgroundColor: "#FFB300" }} />
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-auto pt-1">
                  <Link href="/estudiante/juego?curso=mate&tipo=adivina" className="w-full">
                    <button className="w-full text-white font-bold text-[1rem] px-4 py-4 rounded-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-1 transition-transform shadow-[0_4px_0_0_rgba(0,0,0,0.22)] active:shadow-none"
                      style={{ backgroundColor: "#F59E0B" }}>
                      🎯 ¡Adivina!
                    </button>
                  </Link>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/estudiante/juego?curso=mate&tipo=memoria">
                      <button className="w-full text-white font-bold text-[0.9rem] px-2 py-3.5 rounded-xl flex items-center justify-center gap-1.5 hover:-translate-y-0.5 active:translate-y-1 transition-transform shadow-[0_3px_0_0_rgba(0,0,0,0.2)] active:shadow-none"
                        style={{ backgroundColor: "#06B6D4" }}>
                        🧠 Memoria
                      </button>
                    </Link>
                    <Link href="/estudiante/juego?curso=mate&tipo=completa">
                      <button className="w-full text-white font-bold text-[0.9rem] px-2 py-3.5 rounded-xl flex items-center justify-center gap-1.5 hover:-translate-y-0.5 active:translate-y-1 transition-transform shadow-[0_3px_0_0_rgba(0,0,0,0.2)] active:shadow-none"
                        style={{ backgroundColor: "#8B5CF6" }}>
                        🔤 Completa
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* ── Palabras Amigas ── */}
            <article className="bg-white rounded-[2rem] overflow-hidden flex flex-col group animate-pop-in shadow-lg hover:-translate-y-2 hover:shadow-[0_20px_48px_rgba(41,171,212,0.35)] transition-all duration-300"
              style={{ animationDelay: "0.3s", border: "4px solid #29abd4" }}>
              {/* Cabecera degradada azul/celeste */}
              <div className="relative flex items-center justify-center py-8" style={{ background: "linear-gradient(160deg,#DBEEFF 0%,#7DD3FC 100%)" }}>
                <span className="text-[6rem] leading-none select-none group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">📚</span>
                <div className="absolute top-3 right-3 bg-white/80 text-[#1a5b7a] px-2.5 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm">⭐ +30</div>
              </div>
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="text-center">
                  <h3 className="font-headline-md text-[22px] font-bold text-on-background">Palabras Amigas</h3>
                  <p className="font-body-md text-on-surface-variant text-sm mt-1">Descubre nuevas letras y sonidos.</p>
                </div>
                <div className="w-full space-y-1.5">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-[#1a5b7a]">Progreso</span>
                    <span className="text-[#1a5b7a]">{pctLabel("lenguaje")}</span>
                  </div>
                  <div className="h-3 w-full bg-[#DBEEFF] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: pctWidth("lenguaje"), backgroundColor: "#29abd4" }} />
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-auto pt-1">
                  <Link href="/estudiante/juego?curso=lenguaje&tipo=adivina" className="w-full">
                    <button className="w-full text-white font-bold text-[1rem] px-4 py-4 rounded-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-1 transition-transform shadow-[0_4px_0_0_rgba(0,0,0,0.22)] active:shadow-none"
                      style={{ backgroundColor: "#0EA5E9" }}>
                      🎯 ¡Adivina!
                    </button>
                  </Link>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/estudiante/juego?curso=lenguaje&tipo=memoria">
                      <button className="w-full text-white font-bold text-[0.9rem] px-2 py-3.5 rounded-xl flex items-center justify-center gap-1.5 hover:-translate-y-0.5 active:translate-y-1 transition-transform shadow-[0_3px_0_0_rgba(0,0,0,0.2)] active:shadow-none"
                        style={{ backgroundColor: "#06B6D4" }}>
                        🧠 Memoria
                      </button>
                    </Link>
                    <Link href="/estudiante/juego?curso=lenguaje&tipo=completa">
                      <button className="w-full text-white font-bold text-[0.9rem] px-2 py-3.5 rounded-xl flex items-center justify-center gap-1.5 hover:-translate-y-0.5 active:translate-y-1 transition-transform shadow-[0_3px_0_0_rgba(0,0,0,0.2)] active:shadow-none"
                        style={{ backgroundColor: "#8B5CF6" }}>
                        🔤 Completa
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* ── Ciencias Naturales ── */}
            <article className="bg-white rounded-[2rem] overflow-hidden flex flex-col group animate-pop-in shadow-lg hover:-translate-y-2 hover:shadow-[0_20px_48px_rgba(46,204,113,0.35)] transition-all duration-300"
              style={{ animationDelay: "0.4s", border: "4px solid #2ECC71" }}>
              {/* Cabecera degradada verde/menta */}
              <div className="relative flex items-center justify-center py-8" style={{ background: "linear-gradient(160deg,#D1FAE5 0%,#6EE7B7 100%)" }}>
                <span className="text-[6rem] leading-none select-none group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">🔬</span>
                <div className="absolute top-3 right-3 bg-white/80 text-[#1a5a3a] px-2.5 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm">⭐ +40</div>
              </div>
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="text-center">
                  <h3 className="font-headline-md text-[22px] font-bold text-on-background">Ciencias Naturales</h3>
                  <p className="font-body-md text-on-surface-variant text-sm mt-1">Aprende sobre animales y plantas.</p>
                </div>
                <div className="w-full space-y-1.5">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-[#1a5a3a]">Progreso</span>
                    <span className="text-[#1a5a3a]">{pctLabel("ciencias")}</span>
                  </div>
                  <div className="h-3 w-full bg-[#D1FAE5] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: pctWidth("ciencias"), backgroundColor: "#2ECC71" }} />
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-auto pt-1">
                  <Link href="/estudiante/juego?curso=ciencias&tipo=adivina" className="w-full">
                    <button className="w-full text-white font-bold text-[1rem] px-4 py-4 rounded-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-1 transition-transform shadow-[0_4px_0_0_rgba(0,0,0,0.22)] active:shadow-none"
                      style={{ backgroundColor: "#10B981" }}>
                      🎯 ¡Adivina!
                    </button>
                  </Link>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/estudiante/juego?curso=ciencias&tipo=memoria">
                      <button className="w-full text-white font-bold text-[0.9rem] px-2 py-3.5 rounded-xl flex items-center justify-center gap-1.5 hover:-translate-y-0.5 active:translate-y-1 transition-transform shadow-[0_3px_0_0_rgba(0,0,0,0.2)] active:shadow-none"
                        style={{ backgroundColor: "#06B6D4" }}>
                        🧠 Memoria
                      </button>
                    </Link>
                    <Link href="/estudiante/juego?curso=ciencias&tipo=completa">
                      <button className="w-full text-white font-bold text-[0.9rem] px-2 py-3.5 rounded-xl flex items-center justify-center gap-1.5 hover:-translate-y-0.5 active:translate-y-1 transition-transform shadow-[0_3px_0_0_rgba(0,0,0,0.2)] active:shadow-none"
                        style={{ backgroundColor: "#8B5CF6" }}>
                        🔤 Completa
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* ── Cuidemos la Tierra (bloqueado) ── */}
            <article className="bg-white rounded-[2rem] overflow-hidden flex flex-col group animate-pop-in shadow-lg opacity-70 grayscale-[50%] relative"
              style={{ animationDelay: "0.5s", border: "4px solid #9CA3AF" }}>
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center gap-4">
                <span className="material-symbols-outlined text-5xl text-outline">lock</span>
                <span className="font-body-lg text-outline bg-white px-4 py-2 rounded-full shadow-sm">Alcanza Nivel 6</span>
              </div>
              <div className="relative flex items-center justify-center py-8" style={{ background: "linear-gradient(160deg,#F3F4F6 0%,#D1D5DB 100%)" }}>
                <span className="text-[6rem] leading-none select-none drop-shadow-lg">🌳</span>
                <div className="absolute top-3 right-3 bg-white/80 text-gray-500 px-2.5 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm">⭐ +60</div>
              </div>
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="text-center">
                  <h3 className="font-headline-md text-[22px] font-bold text-on-background">Cuidemos la Tierra</h3>
                  <p className="font-body-md text-on-surface-variant text-sm mt-1">Conoce a los animales y plantas.</p>
                </div>
                <div className="w-full space-y-1.5">
                  <div className="flex justify-between text-sm font-bold text-outline">
                    <span>Progreso</span><span>0%</span>
                  </div>
                  <div className="h-3 w-full bg-surface-variant rounded-full overflow-hidden">
                    <div className="h-full bg-outline rounded-full" style={{ width: "0%" }} />
                  </div>
                </div>
              </div>
            </article>

          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-surface shadow-[0_-4px_12px_rgba(0,103,130,0.1)] rounded-t-xl">
        <a href="#" className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-2xl px-6 py-2 active:scale-90 transition-transform">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="font-label-lg mt-1 text-sm">Home</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:bg-primary-container/20 rounded-2xl">
          <span className="material-symbols-outlined">sports_esports</span>
          <span className="font-label-lg mt-1 text-sm">Games</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:bg-primary-container/20 rounded-2xl">
          <span className="material-symbols-outlined">auto_graph</span>
          <span className="font-label-lg mt-1 text-sm">Progress</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:bg-primary-container/20 rounded-2xl">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-lg mt-1 text-sm">Profile</span>
        </a>
      </nav>
    </div>
  );
}
