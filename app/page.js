"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MakiFox from "@/components/MakiFox";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const COLORS = [
  { id: "red", colorClass: "bg-error", hoverClass: "hover:bg-error/20", lightClass: "bg-error/10" },
  { id: "teal", colorClass: "bg-primary", hoverClass: "hover:bg-primary/20", lightClass: "bg-primary/10" },
  { id: "orange", colorClass: "bg-secondary-container", hoverClass: "hover:bg-secondary-container/20", lightClass: "bg-secondary-container/10" },
  { id: "purple", colorClass: "bg-tertiary", hoverClass: "hover:bg-tertiary/20", lightClass: "bg-tertiary/10" },
];

export default function LoginPage() {
  const [role, setRole] = useState("student"); // "student" or "teacher"
  const [password, setPassword] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [loginSequence, setLoginSequence] = useState([]);
  const router = useRouter();

  const handleLogin = () => {
    if (password === "123456" || password === "demo") {
      router.push(role === "student" ? "/estudiante/menu" : "/profesor/panel");
    } else {
      setFailedAttempts((prev) => prev + 1);
    }
  };

  const handleColorSelect = (colorId) => {
    if (loginSequence.includes(colorId)) return;
    if (loginSequence.length >= 4) return;
    
    const newSequence = [...loginSequence, colorId];
    setLoginSequence(newSequence);
    
    if (newSequence.length === 4) {
      setTimeout(() => {
        router.push(role === "student" ? "/estudiante/menu" : "/profesor/panel");
      }, 500);
    }
  };

  const handleClearSequence = () => {
    setLoginSequence([]);
  };

  return (
    <main className="w-full max-w-[450px] relative z-10 animate-pop-in mx-auto mt-12 md:mt-24 p-4">
      {/* Header / Logo */}
      <div className="text-center mb-8 flex flex-col items-center">
        <MakiFox className="mb-4" />
        <h1 className="font-display-logo text-display-logo text-primary tracking-widest uppercase">
          MAKI
        </h1>
        <p className="font-label-lg text-label-lg text-on-surface-variant uppercase mt-2 tracking-wider">
          Plataforma Educativa · CEBE
        </p>
      </div>

      {/* Auth Card */}
      <Card animate={true}>
        {/* Role Selector Tabs */}
        <div className="flex p-1 bg-surface-variant/30 rounded-2xl mb-6 relative z-10">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`flex-1 py-3 px-4 rounded-xl font-label-lg text-label-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              role === "student"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "bg-transparent text-on-surface-variant hover:bg-surface-variant/50"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={role === "student" ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              school
            </span>
            Estudiante
          </button>
          <button
            type="button"
            onClick={() => setRole("teacher")}
            className={`flex-1 py-3 px-4 rounded-xl font-label-lg text-label-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              role === "teacher"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "bg-transparent text-on-surface-variant hover:bg-surface-variant/50"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={role === "teacher" ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              workspace_premium
            </span>
            Profesor
          </button>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          {role === "student" ? (
            // Student Form
            <>
              <Input
                label="Usuario"
                icon="person"
                type="text"
                placeholder="Nombre de usuario"
              />
              <Input
                label="Contraseña"
                icon="lock"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="pt-2">
                <Button type="button" variant="primary" onClick={handleLogin}>
                  INGRESAR
                </Button>
              </div>
              <div className="text-center mt-4">
                <Link
                  href="/registro"
                  className="font-label-lg text-primary hover:underline"
                >
                  ¿No tienes una cuenta? Regístrate aquí
                </Link>
              </div>
            </>
          ) : (
            // Teacher Form
            <>
              <Input
                label="Correo Electrónico"
                icon="mail"
                type="email"
                placeholder="Correo electrónico"
              />
              <Input
                label="Contraseña"
                icon="lock"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="pt-2">
                <Button type="button" variant="secondary" onClick={handleLogin}>
                  INGRESAR
                </Button>
              </div>
            </>
          )}

          {failedAttempts >= 3 && (
            <div className="space-y-1 flex flex-col items-center text-center mt-6 animate-pop-in bg-error-container/30 p-4 rounded-2xl border border-error/20">
              <label className="block font-label-lg text-sm md:text-label-lg text-error ml-1">
                Demasiados intentos fallidos
              </label>
              <p className="text-[12px] md:text-sm text-on-surface-variant ml-1 mb-1">
                Ingresa tu secuencia de 4 colores secretos para acceder
              </p>
              
              {/* Sequence Display */}
              <div className="flex gap-2 mb-2 items-center min-h-[24px] mt-2">
                {[0, 1, 2, 3].map((index) => {
                  const colorId = loginSequence[index];
                  const colorObj = COLORS.find((c) => c.id === colorId);
                  return (
                    <div 
                      key={index} 
                      className={`w-6 h-6 rounded-full border-2 ${colorObj ? 'border-transparent ' + colorObj.colorClass : 'border-outline-variant bg-surface'}`}
                    ></div>
                  );
                })}
                {loginSequence.length > 0 && (
                  <button type="button" onClick={handleClearSequence} className="ml-2 text-on-surface-variant hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-[20px]">backspace</span>
                  </button>
                )}
              </div>

              <div className="flex gap-2.5 justify-center mt-2">
                {COLORS.map((color) => {
                  const isSelected = loginSequence.includes(color.id);
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
          )}
        </form>
      </Card>

      {/* Dev/Test Users Footer */}
      <div
        className="mt-8 text-center bg-surface-container-highest/80 backdrop-blur-sm px-6 py-3 rounded-full border border-surface-variant max-w-[450px] mx-auto animate-pop-in"
        style={{ animationDelay: "0.2s", opacity: 0, animationFillMode: "forwards" }}
      >
        <p className="font-label-lg text-label-lg text-on-surface-variant flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">info</span>
          Usuarios de prueba: demo_estudiante / demo_profe
        </p>
      </div>
    </main>
  );
}
