"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const CURSO_LABEL = { mate: "Matemáticas", lenguaje: "Palabras", ciencias: "Ciencias" };
const CURSO_EMOJI = { mate: "🔢", lenguaje: "📚", ciencias: "🔬" };
const MEDAL_BG = ["#FFD700", "#C0C0C0", "#CD7F32"];

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
  } catch { return "—"; }
}

function formatFecha(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch { return "—"; }
}

function barColor(pct) {
  if (pct === 100) return "#10B981";
  if (pct >= 50) return "#FFD740";
  return "#29abd4";
}

function exportarCSV(datos) {
  const bom = "﻿";
  const headers = ["Alumno", "Curso", "Progreso (%)", "Fecha"];
  const rows = datos.map(d => [
    `"${(d.nombreAlumno || "").replace(/"/g, '""')}"`,
    `"${CURSO_LABEL[d.curso] || d.curso}"`,
    d.progreso ?? 0,
    `"${formatFecha(d.created_at)}"`,
  ]);
  const csv = bom + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reporte-maki-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const GUIAS = [
  {
    id: "mate",
    titulo: "Guía de Matemáticas Básicas",
    descripcion: "Ejercicios de suma y resta con apoyo visual de frutas y emojis para estudiantes CEBE.",
    emoji: "🔢",
    bgColor: "#FFF3C4",
    borderColor: "#FFD740",
    btnColor: "#F59E0B",
    contenidoHTML: `
      <h1>🔢 Guía de Matemáticas Básicas</h1>
      <p class="sub">Nivel: Primaria · Programa MAKI - CEBE</p>
      <h2>Parte 1: Contar</h2>
      <div class="bloque">
        <p>Cuenta los emojis y escribe el número:</p>
        <div class="linea">🍎 🍎 🍎 &nbsp;= _______</div>
        <div class="linea">🍊 🍊 &nbsp;= _______</div>
        <div class="linea">🐥 🐥 🐥 🐥 🐥 &nbsp;= _______</div>
      </div>
      <h2>Parte 2: Suma</h2>
      <div class="bloque">
        <div class="linea">1 + 1 = _______</div>
        <div class="linea">2 + 3 = _______</div>
        <div class="linea">4 + 1 = _______</div>
        <div class="linea">3 + 3 = _______</div>
        <div class="linea">5 + 2 = _______</div>
      </div>
      <h2>Parte 3: Resta</h2>
      <div class="bloque">
        <div class="linea">3 − 1 = _______</div>
        <div class="linea">5 − 2 = _______</div>
        <div class="linea">6 − 3 = _______</div>
        <div class="linea">8 − 4 = _______</div>
        <div class="linea">4 − 4 = _______</div>
      </div>
      <h2>Parte 4: Problemas</h2>
      <div class="bloque">
        <p>🛒 María tiene 4 manzanas y le dan 3 más. ¿Cuántas tiene ahora?</p>
        <div class="linea">Respuesta: _______</div>
        <p>🦆 Había 6 patos en el lago. Se fueron 2. ¿Cuántos quedan?</p>
        <div class="linea">Respuesta: _______</div>
      </div>`,
  },
  {
    id: "lenguaje",
    titulo: "Guía de Palabras y Letras",
    descripcion: "Ejercicios de reconocimiento de letras y formación de palabras con imágenes.",
    emoji: "📚",
    bgColor: "#DBEEFF",
    borderColor: "#7DD3FC",
    btnColor: "#0EA5E9",
    contenidoHTML: `
      <h1>📚 Guía de Palabras y Letras</h1>
      <p class="sub">Nivel: Primaria · Programa MAKI - CEBE</p>
      <h2>Parte 1: Primera letra</h2>
      <div class="bloque">
        <p>Escribe la primera letra de cada palabra:</p>
        <div class="linea">🍎 MANZANA → _______</div>
        <div class="linea">🐱 GATO → _______</div>
        <div class="linea">🌙 LUNA → _______</div>
        <div class="linea">🐘 ELEFANTE → _______</div>
        <div class="linea">☀️ SOL → _______</div>
      </div>
      <h2>Parte 2: Completa la palabra</h2>
      <div class="bloque">
        <div class="linea">C _ S A &nbsp;→ &nbsp;_______</div>
        <div class="linea">P E _ R O &nbsp;→ &nbsp;_______</div>
        <div class="linea">A G _ A &nbsp;→ &nbsp;_______</div>
        <div class="linea">S _ L &nbsp;→ &nbsp;_______</div>
        <div class="linea">_ R B O L &nbsp;→ &nbsp;_______</div>
      </div>
      <h2>Parte 3: ¿Cuántas letras tiene?</h2>
      <div class="bloque">
        <div class="linea">LUNA tiene _______ letras</div>
        <div class="linea">GATO tiene _______ letras</div>
        <div class="linea">LIBRO tiene _______ letras</div>
        <div class="linea">PATO tiene _______ letras</div>
      </div>
      <h2>Parte 4: Última letra</h2>
      <div class="bloque">
        <div class="linea">🌳 ÁRBOL → _______</div>
        <div class="linea">🐶 PERRO → _______</div>
        <div class="linea">💧 AGUA → _______</div>
      </div>`,
  },
  {
    id: "ciencias",
    titulo: "Guía de Ciencias Naturales",
    descripcion: "Preguntas sobre animales, plantas y el medio ambiente para estudiantes CEBE.",
    emoji: "🔬",
    bgColor: "#D1FAE5",
    borderColor: "#6EE7B7",
    btnColor: "#10B981",
    contenidoHTML: `
      <h1>🔬 Guía de Ciencias Naturales</h1>
      <p class="sub">Nivel: Primaria · Programa MAKI - CEBE</p>
      <h2>Parte 1: ¿Qué animal es?</h2>
      <div class="bloque">
        <div class="linea">🦁 Vive en la selva, es grande y ruge. Es el _______</div>
        <div class="linea">🐟 Vive en el agua y tiene escamas. Es un _______</div>
        <div class="linea">🦋 Vuela y tiene alas de colores. Es una _______</div>
        <div class="linea">🐘 Es el animal terrestre más grande. Es el _______</div>
      </div>
      <h2>Parte 2: ¿Qué come?</h2>
      <div class="bloque">
        <p>Encierra la respuesta correcta:</p>
        <div class="linea">🐄 La vaca come: &nbsp; PASTO &nbsp;&nbsp; / &nbsp;&nbsp; CARNE</div>
        <div class="linea">🐅 El tigre come: &nbsp; PASTO &nbsp;&nbsp; / &nbsp;&nbsp; CARNE</div>
        <div class="linea">🐇 El conejo come: &nbsp; ZANAHORIAS &nbsp;&nbsp; / &nbsp;&nbsp; PESCADO</div>
      </div>
      <h2>Parte 3: ¿Dónde vive?</h2>
      <div class="bloque">
        <div class="linea">🐠 El pez vive en _______</div>
        <div class="linea">🦉 El búho vive en _______</div>
        <div class="linea">🐊 El cocodrilo vive en _______</div>
      </div>
      <h2>Parte 4: Plantas</h2>
      <div class="bloque">
        <div class="linea">Las plantas necesitan _______ y _______ para crecer</div>
        <div class="linea">Las hojas de las plantas son de color _______</div>
        <div class="linea">Las flores sirven para _______</div>
      </div>`,
  },
];

const PDF_STYLES = `
  body{font-family:Arial,sans-serif;padding:40px;max-width:820px;margin:0 auto;color:#222;line-height:1.6}
  h1{color:#29abd4;font-size:28px;border-bottom:3px solid #29abd4;padding-bottom:10px;margin-bottom:4px}
  .sub{color:#888;font-size:14px;margin-top:2px;margin-bottom:24px}
  h2{color:#444;font-size:18px;margin-top:28px;margin-bottom:8px}
  .bloque{background:#f8f9fa;border-left:4px solid #29abd4;padding:14px 20px;margin:10px 0;border-radius:0 8px 8px 0}
  .linea{border-bottom:1px solid #ddd;padding:7px 0;font-size:16px}
  p{margin:6px 0}
  .footer{margin-top:50px;color:#aaa;font-size:12px;text-align:center;border-top:1px solid #eee;padding-top:12px}
  @media print{body{padding:20px}}
`;

function generarPDF(guia) {
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${guia.titulo}</title><style>${PDF_STYLES}</style></head><body>${guia.contenidoHTML}<div class="footer">MAKI · Plataforma Educativa CEBE · Impreso para uso pedagógico</div><script>window.onload=function(){window.print();}<\/script></body></html>`;
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) {
    alert("Permite ventanas emergentes en el navegador para descargar el PDF.");
    return;
  }
  win.document.write(html);
  win.document.close();
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
  const [reportingData, setReportingData] = useState([]);
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
      setReportingData(enriquecido);

      // Ranking: por alumno, progreso por curso + promedio total
      const byId = {};
      for (const p of enriquecido) {
        if (!byId[p.usuario_id]) {
          byId[p.usuario_id] = { nombre: p.nombreAlumno, mate: null, lenguaje: null, ciencias: null };
        }
        if (p.curso === "mate" || p.curso === "lenguaje" || p.curso === "ciencias") {
          byId[p.usuario_id][p.curso] = p.progreso ?? 0;
        }
      }
      const rankingList = Object.values(byId).map(s => {
        const vals = [s.mate, s.lenguaje, s.ciencias].filter(v => v !== null);
        const promedioTotal = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
        return { ...s, promedioTotal };
      }).sort((a, b) => b.promedioTotal - a.promedioTotal);
      setRanking(rankingList);
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
    ranking: "Todos los estudiantes ordenados por progreso total",
    reporting: "Historial completo de actividad",
    guides: "Guías pedagógicas descargables",
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

        {/* Page Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="font-headline-lg text-[28px] md:text-[34px] text-primary mb-1">
              Hola, {nombreProfesor} 👋
            </h1>
            <p className="text-[15px] text-on-surface-variant tracking-normal">{subtitles[activeSection]}</p>
          </div>
          {(activeSection === "dashboard" || activeSection === "ranking" || activeSection === "reporting") && (
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
                <h3 className="font-headline-md text-[20px] text-primary tracking-normal">Actividad Reciente</h3>
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
              <h3 className="font-headline-md text-[20px] text-primary tracking-normal">Ranking de Alumnos</h3>
              <p className="text-sm text-on-surface-variant mt-0.5 tracking-normal">
                Progreso total = promedio de todos los cursos jugados
              </p>
            </div>
            {loading ? (
              <div className="p-10 text-center text-on-surface-variant">Cargando...</div>
            ) : ranking.length === 0 ? (
              <div className="p-10 text-center text-on-surface-variant">Sin datos de progreso aún</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="text-on-surface-variant text-sm border-b border-outline-variant/50">
                      <th className="pb-3 pt-4 pl-5 pr-2 font-normal w-12">#</th>
                      <th className="pb-3 pt-4 px-3 font-normal">Alumno</th>
                      <th className="pb-3 pt-4 px-3 font-normal text-center">🔢 Mate</th>
                      <th className="pb-3 pt-4 px-3 font-normal text-center">📚 Palabras</th>
                      <th className="pb-3 pt-4 px-3 font-normal text-center">🔬 Ciencias</th>
                      <th className="pb-3 pt-4 px-3 font-normal text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranking.map((s, idx) => (
                      <tr key={idx} className={`border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors ${idx < 3 ? "bg-secondary-container/10" : ""}`}>
                        <td className="py-3 pl-5 pr-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm"
                            style={{ backgroundColor: idx < 3 ? MEDAL_BG[idx] : "#e8f4ff", color: idx < 3 ? "#333" : "#29abd4" }}>
                            {idx + 1}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container text-xs font-bold flex-shrink-0">
                              {(s.nombre || "?")[0].toUpperCase()}
                            </div>
                            <span className="font-medium">{s.nombre}</span>
                          </div>
                        </td>
                        {["mate", "lenguaje", "ciencias"].map(curso => (
                          <td key={curso} className="py-3 px-3 text-center">
                            {s[curso] !== null
                              ? <span className="font-bold text-sm" style={{ color: barColor(s[curso]) }}>{s[curso]}%</span>
                              : <span className="text-on-surface-variant text-sm">—</span>
                            }
                          </td>
                        ))}
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex flex-col items-center gap-1">
                            <span className="font-black text-base text-primary">{s.promedioTotal}%</span>
                            <div className="w-16 bg-surface-container rounded-full h-1.5 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${s.promedioTotal}%`, backgroundColor: barColor(s.promedioTotal) }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── REPORTING ── */}
        {activeSection === "reporting" && (
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b-2 border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-headline-md text-[20px] text-primary tracking-normal">Reporte de Actividad</h3>
                <p className="text-sm text-on-surface-variant mt-0.5 tracking-normal">
                  {loading ? "Cargando..." : `${reportingData.length} registros en total`}
                </p>
              </div>
              {!loading && reportingData.length > 0 && (
                <button onClick={() => exportarCSV(reportingData)}
                  className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity flex-shrink-0 self-start sm:self-auto">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Exportar CSV
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-10 text-center text-on-surface-variant">Cargando datos...</div>
              ) : reportingData.length === 0 ? (
                <div className="p-10 text-center text-on-surface-variant">Sin registros de actividad aún</div>
              ) : (
                <table className="w-full text-left min-w-[560px]">
                  <thead>
                    <tr className="text-on-surface-variant text-sm border-b border-outline-variant/50">
                      <th className="pb-3 pt-4 pl-5 pr-3 font-normal">Alumno</th>
                      <th className="pb-3 pt-4 px-3 font-normal">Curso</th>
                      <th className="pb-3 pt-4 px-3 font-normal">Progreso</th>
                      <th className="pb-3 pt-4 px-3 font-normal">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportingData.map((item, idx) => (
                      <tr key={idx} className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                        <td className="py-3 pl-5 pr-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container text-xs font-bold flex-shrink-0">
                              {(item.nombreAlumno || "?")[0].toUpperCase()}
                            </div>
                            <span className="font-medium tracking-normal">{item.nombreAlumno}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-sm tracking-normal">
                          {CURSO_EMOJI[item.curso] || "📖"} {CURSO_LABEL[item.curso] || item.curso}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-surface-container rounded-full h-2 overflow-hidden">
                              <div className="h-full rounded-full"
                                style={{ width: `${item.progreso || 0}%`, backgroundColor: barColor(item.progreso) }} />
                            </div>
                            <span className="text-sm font-bold" style={{ color: barColor(item.progreso) }}>
                              {item.progreso}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-on-surface-variant text-sm tracking-normal whitespace-nowrap">
                          {formatFecha(item.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── GUIDES ── */}
        {activeSection === "guides" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GUIAS.map(guia => (
              <div key={guia.id} className="rounded-2xl border-2 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                style={{ borderColor: guia.borderColor }}>
                {/* Header coloreado */}
                <div className="flex flex-col items-center justify-center py-8 px-4"
                  style={{ backgroundColor: guia.bgColor }}>
                  <span style={{ fontSize: 64, lineHeight: 1 }}>{guia.emoji}</span>
                </div>
                {/* Contenido */}
                <div className="p-5 bg-surface-container-lowest flex flex-col gap-4">
                  <div>
                    <h3 className="font-semibold text-[16px] text-on-surface tracking-normal leading-snug mb-1">
                      {guia.titulo}
                    </h3>
                    <p className="text-sm text-on-surface-variant tracking-normal leading-relaxed">
                      {guia.descripcion}
                    </p>
                  </div>
                  <button onClick={() => generarPDF(guia)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: guia.btnColor }}>
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Descargar PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
