"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";

export default function StudentMenu() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const datos = localStorage.getItem("maki_user");
    if (datos) {
      setUsuario(JSON.parse(datos));
    }
  }, []);

  const nombre = usuario?.nombre || usuario?.email?.split("@")[0] || "Estudiante";

  return (
    <div className="bg-surface text-on-surface min-h-screen pt-20 pb-24 md:pb-0 font-body-md">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-16 h-20 bg-surface shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/">
            <span className="font-display-logo text-[32px] text-primary tracking-widest">
              MAKI
            </span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full font-body-lg text-primary">
            <span className="material-symbols-outlined text-[#feb246]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            <span>124</span>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-tertiary-container px-4 py-2 rounded-full font-body-lg text-on-tertiary-container">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              military_tech
            </span>
            <span>Nivel 5</span>
          </div>
          <div className="flex items-center gap-4">
            <img
              alt="Student avatar"
              className="w-12 h-12 rounded-full border-2 border-primary object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAopSzYtmrAo77UDWel3wyKpPzbaGMbVGSY7-XOeQzEVIca3Z7NYu-w8jVAfI6fm1L-jD8bDkwZPOUevOqb_s5q2dCGjkdHdNnwB-h2ONmyJQZ9KMf_pdvf5FhuuvmQCx3IYKEMcXK-9PJ_mzgedAA9-AEnNyLJU4lCHpbex-0fwJHZC83YQfs5f9nds1zgh_Xb9FisKr_fFeGv7q98bYlAQxHM7-3GRqI98NCKiQYhXhAzO32Bw1EvXo2qfyzRPcU-NrdeO7ZbMNg"
            />
            <span className="font-headline-md text-headline-md font-bold text-primary hidden md:block">
              Hola, {nombre}!
            </span>
          </div>
          <Link href="/">
            <button
              aria-label="Logout"
              className="text-on-surface-variant hover:scale-105 active:scale-95 transition-transform duration-200 p-2"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </Link>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 md:px-16 py-12">
        {/* Hero Section */}
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
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-secondary-container opacity-20 rounded-full blur-xl"></div>
            <div className="flex items-center gap-6 z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                <span className="material-symbols-outlined text-4xl">view_in_ar</span>
              </div>
              <div>
                <h2 className="font-headline-md text-headline-md font-bold text-white flex items-center gap-2">
                  Explorar con Realidad Aumentada <span className="animate-pulse">✨</span>
                </h2>
                <p className="font-body-md text-body-md text-white/90">
                  Descubre animales y números en tu habitación.
                </p>
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

        {/* Course Grid */}
        <section>
          <h2 className="font-headline-md text-headline-md font-bold text-primary mb-8">
            Tus Aventuras
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Course Card: Math */}
            <article className="bg-white/85 backdrop-blur-md border-2 border-surface-variant rounded-[2rem] p-8 flex flex-col gap-6 relative overflow-hidden group animate-pop-in shadow-lg" style={{ animationDelay: "0.2s", borderColor: "#feb246", borderWidth: "4px" }}>
              <div className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-lg flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> +50
              </div>
              <div className="flex justify-center py-4">
                <span className="text-[4rem] group-hover:scale-110 transition-transform duration-300 drop-shadow-md select-none">🔢</span>
              </div>
              <div className="text-center">
                <h3 className="font-headline-md text-[24px] font-bold text-on-background">Matemáticas Mágicas</h3>
                <p className="font-body-md text-on-surface-variant">Aprende a sumar con MAKI.</p>
              </div>
              <div className="w-full space-y-2">
                <div className="flex justify-between font-label-lg">
                  <span className="text-primary font-bold">Progreso</span>
                  <span className="text-primary font-bold">60%</span>
                </div>
                <div className="h-4 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-container rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-4 mt-auto pt-4">
                <Link href="/estudiante/juego?curso=mate&tipo=adivina" className="w-full">
                  <button className="w-full shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none bg-secondary-container text-on-secondary-container font-body-lg px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:-translate-y-1 transition-transform">
                    <span>🎯</span> Adivina
                  </button>
                </Link>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/estudiante/juego?curso=mate&tipo=memoria">
                    <button className="w-full shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none bg-surface-container-high text-primary font-body-md px-2 py-3 rounded-xl flex items-center justify-center gap-2 hover:-translate-y-1 transition-transform">
                      <span>🧠</span> Memoria
                    </button>
                  </Link>
                  <Link href="/estudiante/juego?curso=mate&tipo=completa">
                    <button className="w-full shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none bg-surface-container-high text-primary font-body-md px-2 py-3 rounded-xl flex items-center justify-center gap-2 hover:-translate-y-1 transition-transform">
                      <span>🔤</span> Completa
                    </button>
                  </Link>
                </div>
              </div>
            </article>

            {/* Course Card: Language */}
            <article className="bg-white/85 backdrop-blur-md border-2 border-surface-variant rounded-[2rem] p-8 flex flex-col gap-6 relative overflow-hidden group animate-pop-in shadow-lg" style={{ animationDelay: "0.3s", borderColor: "#29abd4", borderWidth: "4px" }}>
              <div className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-lg flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> +30
              </div>
              <div className="flex justify-center py-4">
                <span className="text-[4rem] group-hover:scale-110 transition-transform duration-300 drop-shadow-md select-none">📚</span>
              </div>
              <div className="text-center">
                <h3 className="font-headline-md text-[24px] font-bold text-on-background">Palabras Amigas</h3>
                <p className="font-body-md text-on-surface-variant">Descubre nuevas letras y sonidos.</p>
              </div>
              <div className="w-full space-y-2">
                <div className="flex justify-between font-label-lg">
                  <span className="text-primary font-bold">Progreso</span>
                  <span className="text-primary font-bold">25%</span>
                </div>
                <div className="h-4 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-primary-container rounded-full" style={{ width: "25%" }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-4 mt-auto pt-4">
                <Link href="/estudiante/juego?curso=lenguaje&tipo=adivina" className="w-full">
                  <button className="w-full shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none bg-primary-container text-on-primary-container font-body-lg px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:-translate-y-1 transition-transform">
                    <span>🎯</span> Adivina
                  </button>
                </Link>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/estudiante/juego?curso=lenguaje&tipo=memoria">
                    <button className="w-full shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none bg-surface-container-high text-primary font-body-md px-2 py-3 rounded-xl flex items-center justify-center gap-2 hover:-translate-y-1 transition-transform">
                      <span>🧠</span> Memoria
                    </button>
                  </Link>
                  <Link href="/estudiante/juego?curso=lenguaje&tipo=completa">
                    <button className="w-full shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none bg-surface-container-high text-primary font-body-md px-2 py-3 rounded-xl flex items-center justify-center gap-2 hover:-translate-y-1 transition-transform">
                      <span>🔤</span> Completa
                    </button>
                  </Link>
                </div>
              </div>
            </article>

            {/* Course Card: Environment (Locked) */}
            <article className="bg-white/85 backdrop-blur-md border-2 border-surface-variant rounded-[2rem] p-8 flex flex-col gap-6 relative overflow-hidden group opacity-80 grayscale-[30%] animate-pop-in shadow-lg" style={{ animationDelay: "0.4s" }}>
              <div className="absolute inset-0 bg-surface/40 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center gap-4">
                <span className="material-symbols-outlined text-5xl text-outline">lock</span>
                <span className="font-body-lg text-outline bg-white px-4 py-2 rounded-full shadow-sm">Alcanza Nivel 6</span>
              </div>
              <div className="flex justify-center py-4">
                <span className="text-[4rem] drop-shadow-md select-none">🌳</span>
              </div>
              <div className="text-center">
                <h3 className="font-headline-md text-[24px] font-bold text-on-background">Cuidemos la Tierra</h3>
                <p className="font-body-md text-on-surface-variant">Conoce a los animales y plantas.</p>
              </div>
              <div className="w-full space-y-2">
                <div className="flex justify-between font-label-lg">
                  <span className="text-outline font-bold">Progreso</span>
                  <span className="text-outline font-bold">0%</span>
                </div>
                <div className="h-4 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-outline rounded-full" style={{ width: "0%" }}></div>
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