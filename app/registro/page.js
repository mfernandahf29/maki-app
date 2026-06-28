"use client";
import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const COLORS = [
  { id: "red", colorClass: "bg-error", hoverClass: "hover:bg-error/20", lightClass: "bg-error/10" },
  { id: "teal", colorClass: "bg-primary", hoverClass: "hover:bg-primary/20", lightClass: "bg-primary/10" },
  { id: "orange", colorClass: "bg-secondary-container", hoverClass: "hover:bg-secondary-container/20", lightClass: "bg-secondary-container/10" },
  { id: "purple", colorClass: "bg-tertiary", hoverClass: "hover:bg-tertiary/20", lightClass: "bg-tertiary/10" },
];

export default function RegisterPage() {
  const [role, setRole] = useState("student"); // "student" or "teacher"
  const [recoverySequence, setRecoverySequence] = useState([]);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const handleColorSelect = (colorId) => {
    if (recoverySequence.includes(colorId)) return;
    if (recoverySequence.length >= 4) return;
    setRecoverySequence([...recoverySequence, colorId]);
  };

  const handleClearSequence = () => {
    setRecoverySequence([]);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-3 md:p-6 text-on-surface">
      <div className="w-full mx-auto my-auto bg-surface-container-lowest rounded-[2rem] border-2 border-surface-variant p-5 md:p-7 shadow-[0_12px_32px_rgba(0,103,130,0.15)] animate-pop-in relative overflow-hidden max-w-[580px]">
        {/* Decorative Elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-container rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary-container rounded-full opacity-20 blur-2xl"></div>

        {/* Logo & Header */}
        <div className="text-center mb-9 relative z-10">
          <div className="inline-flex w-14 h-14 bg-primary-container rounded-full mb-1 items-center justify-center animate-floating shadow-md border-2 border-surface-container-lowest mx-auto">
            <span
              className="material-symbols-outlined text-[32px] text-surface-container-lowest"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              school
            </span>
          </div>
          <h1 className="font-display-logo text-[32px] md:text-[38px] text-primary tracking-widest mb-0 uppercase leading-none">
            MAKI
          </h1>
          <p className="font-body-md text-[14px] md:text-[16px] text-on-surface-variant mt-1 leading-normal">
            Crea tu cuenta para comenzar a jugar
          </p>
        </div>

        {/* Role Selector */}
        <div className="relative flex p-1 bg-surface-variant/30 rounded-2xl mb-9 relative z-10 select-none">
          {/* Sliding Indicator */}
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-surface-container-lowest rounded-xl shadow-md transition-transform duration-300 ease-out left-1 ${
              role === "student" ? "translate-x-0" : "translate-x-full"
            }`}
          />

          <button
            type="button"
            onClick={() => handleRoleChange("student")}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all duration-300 font-label-lg text-sm md:text-label-lg font-bold ${
              role === "student"
                ? "text-primary"
                : "text-on-surface-variant hover:bg-surface-variant/50"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: role === "student" ? "'FILL' 1" : "'FILL' 0" }}
            >
              school
            </span>
            Estudiante
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("teacher")}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all duration-300 font-label-lg text-sm md:text-label-lg font-bold ${
              role === "teacher"
                ? "text-primary"
                : "text-on-surface-variant hover:bg-surface-variant/50"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: role === "teacher" ? "'FILL' 1" : "'FILL' 0" }}
            >
              workspace_premium
            </span>
            Profesor
          </button>
        </div>

        {/* Form */}
        <form className="space-y-3.5 relative z-10">
          {/* Common Fields */}
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <Input
                label="Nombre de Usuario"
                icon="person"
                placeholder="Ej: SuperLeo"
                size="sm"
              />
              <Input
                label="Correo Electrónico"
                icon="mail"
                type="email"
                placeholder="correo@ejemplo.com"
                size="sm"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <Input
                label="Contraseña"
                icon="lock"
                type="password"
                placeholder="••••••••"
                size="sm"
              />
              <Input
                label="Repetir Contraseña"
                icon="lock_reset"
                type="password"
                placeholder="••••••••"
                size="sm"
              />
            </div>
          </div>

          {/* Student Specific Field */}
          {role === "student" && (
            <div className="space-y-1.5 mb-10 transition-all duration-300 animate-pop-in">
              <div>
                <label className="block font-label-lg text-label-lg text-on-surface mb-1 ml-1">
                  Grado Escolar
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">
                    auto_stories
                  </span>
                  <select className="w-full bg-surface border-2 border-outline-variant rounded-xl py-2 pl-12 pr-4 font-body-md text-[16px] text-on-surface focus:border-primary focus:ring-0 focus:shadow-[0_0_0_4px_theme(colors.surface-variant)] transition-all outline-none appearance-none">
                    <option value="">Selecciona tu grado</option>
                    <option value="1">1ero de Primaria ☁☁☁</option>
                    <option value="2">2do de Primaria ☁☁</option>
                    <option value="3">3ero de Primaria ☁</option>
                    <option value="4">4to de Primaria ☀☀</option>
                    <option value="5">5to de Primaria ☀</option>
                    <option value="6">6to de Primaria ✨</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Recovery Method (Color Sequence) */}
          <div className="space-y-1 flex flex-col items-center text-center mt-2">
            <label className="block font-label-lg text-sm md:text-label-lg text-on-surface ml-1">
              Método de Recuperación (Secuencia)
            </label>
            <p className="text-[12px] md:text-sm text-on-surface-variant ml-1 mb-1">
              Selecciona un patrón de 4 colores
            </p>
            
            {/* Sequence Display */}
            <div className="flex gap-2 mb-2 items-center min-h-[24px]">
              {[0, 1, 2, 3].map((index) => {
                const colorId = recoverySequence[index];
                const colorObj = COLORS.find((c) => c.id === colorId);
                return (
                  <div 
                    key={index} 
                    className={`w-6 h-6 rounded-full border-2 ${colorObj ? 'border-transparent ' + colorObj.colorClass : 'border-outline-variant bg-surface'}`}
                  ></div>
                );
              })}
              {recoverySequence.length > 0 && (
                <button type="button" onClick={handleClearSequence} className="ml-2 text-on-surface-variant hover:text-error transition-colors">
                  <span className="material-symbols-outlined text-[20px]">backspace</span>
                </button>
              )}
            </div>

            <div className="flex gap-2.5 justify-center">
              {COLORS.map((color) => {
                const isSelected = recoverySequence.includes(color.id);
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => handleColorSelect(color.id)}
                    disabled={isSelected}
                    className={`relative block w-11 h-11 rounded-full flex items-center justify-center transition-all 
                      ${isSelected ? 'bg-surface-variant cursor-not-allowed opacity-60' : color.lightClass + ' cursor-pointer hover:scale-110 ' + color.hoverClass}
                    `}
                  >
                    <span className={`block w-8 h-8 rounded-xl shadow-sm transition-colors ${isSelected ? 'bg-outline-variant' : color.colorClass}`}></span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-1 mt-7">
            <Link href="/" className="w-full block">
              <Button type="button" variant="primary" className="py-2 text-lg md:text-lg font-bold">
                CREAR CUENTA
                <span className="material-symbols-outlined font-bold text-lg md:text-xl">
                  arrow_forward
                </span>
              </Button>
            </Link>
          </div>

          <div className="text-center mt-2">
            <Link
              href="/"
              className="font-body-md text-sm md:text-body-md text-primary hover:text-primary-container underline underline-offset-4 transition-colors"
            >
              Volver al Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
