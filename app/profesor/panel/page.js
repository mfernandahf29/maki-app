"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const CURSO_LABEL = { mate: "Matemáticas", lenguaje: "Palabras", ciencias: "Ciencias" };
const CURSO_EMOJI = { mate: "🔢", lenguaje: "📚", ciencias: "🔬" };

function formatHora(iso) {
  if (!iso) return "—";
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Ahora";
    if (mins < 60) return `Hace ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `Hace ${hrs}h`;
    return `Hace ${Math.floor(hrs / 24)}d`;
  } catch {
    return "—";
  }
}

function barColor(pct) {
  if (pct === 100) return "#10B981";
  if (pct >= 50) return "#FFD740";
  return "#29abd4";
}

function StatCard({ icon, bgClass, fgClass, label, value }) {
  return (
    <div className="bg-surface-container-lowest border-2 border-outline-variant p-5 md:p-6 rounded-2xl shadow-sm hover:scale-[1.02] transition-transform">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${bgClass} ${fgClass}`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <span className="text-xs md:text-sm text-on-surface-variant leading-tight">{label}</span>
      </div>
      <div className="text-[38px] md:text-[48px] font-black text-on-surface leading-none">{value}</div>
    </div>
  );
}

export default function TeacherPanel() {
  const [nombreProfesor, setNombreProfesor] = useState("Profesor");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [stats, setStats] = useState({ alumnos: 0, promedio: 0, guiasCompletas: 0, insignias: 0 });
  const [actividad, setActividad] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("maki_user");
    if (raw) {
      try {
        const user = JSON.parse(raw);
        setNombreProfesor(user.nombre || "Profesor");
      } catch {}
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [alumnosRes, progresoRes, estudiantesRes] = await Promise.all([
        supabase.from("usuarios").select("id", { count: "exact", head: true }).eq("rol", "estudiante"),
        supabase.from("progreso").select("*").order("created_at", { ascending: false }),
        supabase.from("usuarios").select("id, nombre").eq("rol", "estudiante"),
      ]);

      const alumnosCount = alumnosRes.count || 0;
      const progresos = progresoRes.data || [];
      const estudiantes = estudiantesRes.data || [];

      const nomMap = {};
      for (const e of estudiantes) {
        nomMap[e.id] = e.nombre;
        nomMap[String(e.id)] = e.nombre;
      }

      const enriquecido = progresos.map(p => ({
        ...p,
        nombreAlumno: nomMap[p.usuario_id] || nomMap[String(p.usuario_id)] || "—",
      }));

      const promedio = progresos.length
        ? Math.round(progresos.reduce((s, p) => s + (p.progreso || 0), 0) / progresos.length)
        : 0;
      const guiasCompletas = progresos.filter(p => p.progreso === 100).length;
      const insignias = progresos.filter(p => p.progreso >= 50).length;

      setStats({ alumnos: alumnosCount, promedio, guiasCompletas, insignias });
      setActividad(enriquecido.slice(0, 12));

      const byId = {};
      for (const p of enriquecido) {
        if (!byId[p.usuario_id]) {
          byId[p.usuario_id] = { nombre: p.nombreAlumno, mejorProgreso: 0, mejorCurso: "" };
        }
        if ((p.progreso || 0) > byId[p.usuario_id].mejorProgreso) {
          byId[p.usuario_id].mejorProgreso = p.progreso;
          byId[p.usuario_id].mejorCurso = p.curso;
        }
      }
      setRanking(Object.values(byId).sort((a, b) => b.mejorProgreso - a.mejorProgreso));
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { key: "dashboard", icon: "dashboard", label: "Dashboard" },
    { key: "ranking", icon: "leaderboard", label: "Ranking" },
    { key: "reporting", icon: "assessment", label: "Reporting" },
    { key: "guides", icon: "menu_book", label: "Guides" },
  ];

  const subtitles = {
    dashboard: "Resumen de actividad de tus alumnos",
    ranking: "Alumnos ordenados por mejor progreso",
    reporting: "Reportes de desempeño",
    guides: "Guías y recursos pedagógicos",
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex overflow-hidden">

      {/* Mobile Top App Bar */}
      <header className="lg:hidden fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-surface shadow-sm">
        <h1 className="font-display-logo text-[24px] text-primary tracking-widest">MAKI</h1>
        <div className="flex gap-1">
          {navItems.map(item => (
            <button key={item.key} onClick={() => setActiveSection(item.key)}
              className={`p-2 rounded-full transition-colors ${activeSection === item.key ? "bg-secondary-container text-on-secondary-container" : "text-on-surface-variant"}`}>
              <span className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: activeSection === item.key ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* Sidebar Desktop */}
      <nav className="hidden lg:flex flex-col h-screen fixed left-0 top-0 py-8 gap-4 bg-surface-container-low border-r-2 border-outline-variant shadow-md w-72 rounded-r-xl z-40">
        <div className="px-6 pb-5 flex flex-col items-center border-b border-outline-variant/30">
          <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-sm mb-2">
            <img src="/logo-maki.png" alt="MAKI" className="w-full h-full object-cover" />
          </div>
          <h2 className="font-headline-md text-[20px] text-primary text-center">MAKI</h2>
          <p className="text-sm text-on-surface-variant">Panel del Profesor</p>
        </div>

        <div className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.key} onClick={() => setActiveSection(item.key)}
              className={`flex items-center gap-4 px-4 py-3 rounded-full mx-2 my-0.5 transition-all font-body-md text-left w-[calc(100%-16px)] ${
                activeSection === item.key
                  ? "bg-secondary-container text-on-secondary-container"
                  : "text-on-surface-variant hover:bg-surface-variant"
              }`}>
              <span className="material-symbols-outlined"
                style={{ fontVariationSettings: activeSection === item.key ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="px-6 mt-auto">
          <Link href="/" className="w-full block">
            <button className="w-full flex items-center justify-center gap-3 py-3 rounded-full border-2 border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined">logout</span>
              Cerrar Sesión
            </button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 pt-20 lg:pt-8 px-4 md:px-10 pb-12 overflow-y-auto w-full">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="font-headline-lg text-[28px] md:text-[34px] text-primary mb-1">
              Hola, {nombreProfesor} 👋
            </h1>
            <p className="text-[15px] text-on-surface-variant">{subtitles[activeSection]}</p>
          </div>
          {activeSection === "dashboard" && (
            <button onClick={fetchData}
              className="flex items-center gap-2 bg-surface-container-high text-primary px-4 py-2 rounded-full text-sm hover:bg-surface-variant transition-colors mt-1 flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              <span className="hidden md:inline">Actualizar</span>
            </button>
          )}
        </div>

        {/* ── DASHBOARD ── */}
        {activeSection === "dashboard" && (
          <>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
              <StatCard icon="groups" bgClass="bg-primary-container" fgClass="text-on-primary-container"
                label="Alumnos Activos" value={loading ? "—" : stats.alumnos} />
              <StatCard icon="star" bgClass="bg-secondary-container" fgClass="text-on-secondary-container"
                label="Promedio Clase" value={loading ? "—" : `${stats.promedio}%`} />
              <StatCard icon="task_alt" bgClass="bg-surface-variant" fgClass="text-on-surface"
                label="Guías Completadas" value={loading ? "—" : stats.guiasCompletas} />
              <StatCard icon="military_tech" bgClass="bg-tertiary-container" fgClass="text-on-tertiary-container"
                label="Insignias Otorgadas" value={loading ? "—" : stats.insignias} />
            </div>

            <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b-2 border-outline-variant flex items-center justify-between">
                <h3 className="font-headline-md text-[20px] text-primary">Actividad Reciente</h3>
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-10 text-center text-on-surface-variant">Cargando datos...</div>
                ) : actividad.length === 0 ? (
                  <div className="p-10 text-center text-on-surface-variant">Sin actividad registrada aún</div>
                ) : (
                  <table className="w-full text-left min-w-[480px]">
                    <thead>
                      <tr className="text-on-surface-variant text-sm border-b border-outline-variant/50">
                        <th className="pb-3 pt-4 pl-5 pr-3 font-normal">Alumno</th>
                        <th className="pb-3 pt-4 px-3 font-normal">Curso</th>
                        <th className="pb-3 pt-4 px-3 font-normal">Progreso</th>
                        <th className="pb-3 pt-4 px-3 font-normal">Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      {actividad.map((item, idx) => (
                        <tr key={idx} className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                          <td className="py-3 pl-5 pr-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container text-sm font-bold flex-shrink-0">
                                {(item.nombreAlumno || "?")[0].toUpperCase()}
                              </div>
                              <span className="font-medium">{item.nombreAlumno}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-on-surface-variant text-sm">
                            {CURSO_EMOJI[item.curso] || "📖"} {CURSO_LABEL[item.curso] || item.curso}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-surface-container rounded-full h-2.5 overflow-hidden">
                                <div className="h-full rounded-full"
                                  style={{ width: `${item.progreso || 0}%`, backgroundColor: barColor(item.progreso) }} />
                              </div>
                              <span className="text-sm font-bold text-primary">{item.progreso}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-on-surface-variant text-sm whitespace-nowrap">
                            {formatHora(item.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── RANKING ── */}
        {activeSection === "ranking" && (
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b-2 border-outline-variant">
              <h3 className="font-headline-md text-[20px] text-primary">Ranking de Alumnos</h3>
              <p className="text-sm text-on-surface-variant mt-0.5">Mejor curso por estudiante, de mayor a menor</p>
            </div>
            {loading ? (
              <div className="p-10 text-center text-on-surface-variant">Cargando...</div>
            ) : ranking.length === 0 ? (
              <div className="p-10 text-center text-on-surface-variant">Sin datos de progreso aún</div>
            ) : (
              <div className="divide-y divide-outline-variant/20">
                {ranking.map((student, idx) => {
                  const medalBg = ["#FFD700", "#C0C0C0", "#CD7F32"];
                  const isMedal = idx < 3;
                  return (
                    <div key={idx} className={`flex items-center gap-4 px-5 py-4 hover:bg-surface-container-low transition-colors ${isMedal ? "bg-secondary-container/10" : ""}`}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-base flex-shrink-0"
                        style={{ backgroundColor: isMedal ? medalBg[idx] : "#e8f4ff", color: isMedal ? "#333" : "#29abd4" }}>
                        {idx + 1}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold flex-shrink-0">
                        {(student.nombre || "?")[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-on-surface truncate">{student.nombre}</div>
                        <div className="text-xs text-on-surface-variant">
                          {CURSO_EMOJI[student.mejorCurso] || ""} {CURSO_LABEL[student.mejorCurso] || student.mejorCurso || "Sin curso"}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <div className="font-black text-xl text-primary">{student.mejorProgreso}%</div>
                        <div className="w-24 bg-surface-container rounded-full h-2 overflow-hidden">
                          <div className="h-full rounded-full"
                            style={{ width: `${student.mejorProgreso}%`, backgroundColor: barColor(student.mejorProgreso) }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── REPORTING ── */}
        {activeSection === "reporting" && (
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl shadow-sm p-12 text-center">
            <span className="material-symbols-outlined text-[64px] text-on-surface-variant mb-4 block">assessment</span>
            <h3 className="font-headline-md text-[22px] text-primary mb-2">Reportes Detallados</h3>
            <p className="text-on-surface-variant max-w-md mx-auto">
              Próximamente: exportar reportes PDF, gráficos de progreso por curso, y análisis individual por alumno.
            </p>
          </div>
        )}

        {/* ── GUIDES ── */}
        {activeSection === "guides" && (
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl shadow-sm p-12 text-center">
            <span className="material-symbols-outlined text-[64px] text-on-surface-variant mb-4 block">menu_book</span>
            <h3 className="font-headline-md text-[22px] text-primary mb-2">Guías Pedagógicas</h3>
            <p className="text-on-surface-variant max-w-md mx-auto">
              Próximamente: guías descargables para actividades en clase con estudiantes del CEBE.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
