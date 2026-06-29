"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MakiFox from "@/components/MakiFox";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .eq("rol", role === "student" ? "estudiante" : "profesor")
      .single();
    if (error || !data) {
      setError("Correo, contraseña o rol incorrecto");
      setLoading(false);
      return;
    }
    localStorage.setItem("maki_user", JSON.stringify(data));
    router.push(role === "student" ? "/estudiante/menu" : "/profesor/panel");
    setLoading(false);
  };

  return (
    <main className="w-full max-w-[450px] relative z-10 animate-pop-in mx-auto mt-12 md:mt-24 p-4">
      <div className="text-center mb-8 flex flex-col items-center">
        <MakiFox className="mb-4" />
        <h1 className="font-display-logo text-display-logo text-primary tracking-widest uppercase">MAKI</h1>
        <p className="font-label-lg text-label-lg text-on-surface-variant uppercase mt-2 tracking-wider">Plataforma Educativa · CEBE</p>
      </div>
      <Card animate={true}>
        <div className="flex p-1 bg-surface-variant/30 rounded-2xl mb-6">
          <button type="button" onClick={() => setRole("student")} className={`flex-1 py-3 px-4 rounded-xl font-label-lg transition-all flex items-center justify-center gap-2 ${role === "student" ? "bg-surface-container-lowest text-primary shadow-sm" : "bg-transparent text-on-surface-variant"}`}>
            <span className="material-symbols-outlined">school</span>Estudiante
          </button>
          <button type="button" onClick={() => setRole("teacher")} className={`flex-1 py-3 px-4 rounded-xl font-label-lg transition-all flex items-center justify-center gap-2 ${role === "teacher" ? "bg-surface-container-lowest text-primary shadow-sm" : "bg-transparent text-on-surface-variant"}`}>
            <span className="material-symbols-outlined">workspace_premium</span>Profesor
          </button>
        </div>
        <div className="space-y-6">
          <Input label="Correo Electrónico" icon="mail" type="email" placeholder="tucorreo@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Contraseña" icon="lock" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="pt-2">
            <Button type="button" variant={role === "student" ? "primary" : "secondary"} onClick={handleLogin}>
              {loading ? "INGRESANDO..." : "INGRESAR"}
            </Button>
          </div>
          <div className="text-center mt-4">
            <Link href="/registro" className="font-label-lg text-primary hover:underline">¿No tienes una cuenta? Regístrate aquí</Link>
          </div>
        </div>
      </Card>
    </main>
  );
}