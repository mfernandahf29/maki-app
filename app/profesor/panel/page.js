"use client";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function TeacherPanel() {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleOpenStudent = (studentId) => {
    // In a real app we'd fetch student details based on ID
    setSelectedStudent(studentId);
  };

  const handleCloseStudent = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex overflow-hidden">
      {/* Mobile Top App Bar */}
      <header className="lg:hidden fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-20 bg-surface shadow-sm">
        <h1 className="font-display-logo text-[28px] text-primary tracking-widest">
          MAKI
        </h1>
        <button aria-label="Menu" className="p-2 text-primary">
          <span className="material-symbols-outlined text-[32px]">menu</span>
        </button>
      </header>

      {/* SideNavBar (Desktop) */}
      <nav className="hidden lg:flex flex-col h-screen fixed left-0 top-0 py-8 gap-6 bg-surface-container-low border-r-2 border-outline-variant shadow-md w-72 rounded-r-xl z-40">
        <div className="px-6 pb-6 flex flex-col items-center border-b border-outline-variant/30">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-sm mb-2">
            <img
              alt="Teacher profile picture"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdVrNgdkxLgv93X5osBI7ViKiqrwoQvkXyNp8vN9OccN3P7dMbsbKrNFCPTbGqF5H4zuf-IvgT3HfWmttEnAT_Wwsdz7bAxPIbdLRoCyP9xWz4YVUgRaI0LASOnmE06zPccGG2H8fsE6vGZ3VeeFMxr21c3cXfr_swLMo8O4taut4e9cokp3lDgeXQtigw3mTG8aF2b9fkYebTq-GU2H9eJv2Hcd-AfLmTumnf4_sF08EyjphTWcwZOWrm9qD49Tsq3U68NFG2om0"
            />
          </div>
          <h2 className="font-headline-md text-[24px] text-primary text-center">
            Project MAKI
          </h2>
          <p className="font-body-md text-label-lg text-on-surface-variant">
            Teacher Portal
          </p>
        </div>

        <div className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto">
          {/* Active Item */}
          <a
            aria-current="page"
            className="flex items-center gap-6 px-4 py-3 bg-secondary-container text-on-secondary-container rounded-full mx-2 my-1 hover:scale-[1.02] transition-all font-body-md"
            href="#"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              dashboard
            </span>
            <span>Dashboard</span>
          </a>
          {/* Inactive Items */}
          {[
            { icon: "leaderboard", label: "Ranking" },
            { icon: "assessment", label: "Reporting" },
            { icon: "menu_book", label: "Guides" },
            { icon: "settings", label: "Management" },
          ].map((item) => (
            <a
              key={item.label}
              className="flex items-center gap-6 px-4 py-3 text-on-surface-variant hover:bg-surface-variant rounded-full mx-2 my-1 hover:scale-[1.02] transition-all font-body-md"
              href="#"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        <div className="px-6 mt-auto">
          <Link href="/" className="w-full">
            <button className="w-full flex items-center justify-center gap-4 py-3 rounded-full border-2 border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-colors font-body-md">
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </Link>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-1 lg:ml-72 pt-24 lg:pt-8 px-4 md:px-16 pb-12 overflow-y-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="font-headline-lg text-[36px] text-primary mb-2">
              Hola, Prof. Gómez
            </h1>
            <p className="font-body-md text-[20px] text-on-surface-variant">
              Resumen de actividad de hoy para Nivel 3
            </p>
          </div>
          <div className="flex gap-4">
            <button className="bg-surface-container-high text-primary px-6 py-3 rounded-full font-body-md flex items-center gap-2 hover:bg-surface-variant transition-colors shadow-[0_4px_12px_rgba(0,103,130,0.08)]">
              <span className="material-symbols-outlined">filter_list</span> Filtrar
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12 animate-pop-in">
          {/* Card 1 */}
          <div className="bg-surface-container-lowest border-2 border-outline-variant p-8 rounded-xl shadow-[0_4px_12px_rgba(0,103,130,0.08)] hover:scale-[1.02] transition-transform relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-surface-container-high rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined">groups</span>
              </div>
              <span className="font-body-md text-label-lg text-on-surface-variant">
                Alumnos Activos
              </span>
            </div>
            <div className="font-headline-lg text-[48px] text-on-surface leading-none">
              24
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-surface-container-lowest border-2 border-outline-variant p-8 rounded-xl shadow-[0_4px_12px_rgba(0,103,130,0.08)] hover:scale-[1.02] transition-transform relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary-fixed rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined">star</span>
              </div>
              <span className="font-body-md text-label-lg text-on-surface-variant">
                Promedio Clase
              </span>
            </div>
            <div className="font-headline-lg text-[48px] text-on-surface leading-none">
              85<span className="text-[20px]">%</span>
            </div>
          </div>
          {/* Card 3 */}
          <div className="bg-surface-container-lowest border-2 border-outline-variant p-8 rounded-xl shadow-[0_4px_12px_rgba(0,103,130,0.08)] hover:scale-[1.02] transition-transform relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-surface-container-high rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full bg-surface-variant text-on-surface flex items-center justify-center">
                <span className="material-symbols-outlined">task_alt</span>
              </div>
              <span className="font-body-md text-label-lg text-on-surface-variant">
                Guías Completadas
              </span>
            </div>
            <div className="font-headline-lg text-[48px] text-on-surface leading-none">
              128
            </div>
          </div>
          {/* Card 4 */}
          <div className="bg-surface-container-lowest border-2 border-outline-variant p-8 rounded-xl shadow-[0_4px_12px_rgba(0,103,130,0.08)] hover:scale-[1.02] transition-transform relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-surface-container-high rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
                <span className="material-symbols-outlined">military_tech</span>
              </div>
              <span className="font-body-md text-label-lg text-on-surface-variant">
                Insignias Otorgadas
              </span>
            </div>
            <div className="font-headline-lg text-[48px] text-on-surface leading-none">
              32
            </div>
          </div>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Alertas */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <h3 className="font-headline-md text-[24px] text-error flex items-center gap-2">
              <span className="material-symbols-outlined">warning</span> Alertas
            </h3>

            {/* Alert Cards */}
            <div className="bg-error-container border-2 border-error/20 rounded-xl p-6 shadow-[0_4px_12px_rgba(0,103,130,0.08)] hover:border-error/50 transition-colors">
              <div className="flex items-start gap-4 mb-2">
                <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex-shrink-0 overflow-hidden border border-outline-variant">
                  <img
                    alt="Student avatar"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgS5qjWbAtgzU5A-_5ICInS_SOat62PDbhuKlON2NtxOdpDObpNmxR4zwElJIFHEwFORIp-QVtQGwhBq79PO-ZPeKn-FZqQU7Iw1CGieV8Snmo__u-KlEgav9-34lQ82Q-_8UY5Bh4JxwvPX62xL8OKmY8YCsmbnYtVl2nuxuPa_cWhAuItkIMTtb5zOp9bi-4GK6alwFsnX3lnseDZcL7nY8DlsqnLT3V0CtfNDy_Spy_XewL8M0KNpK8rMoYiib9-_777HyiGD8"
                  />
                </div>
                <div>
                  <h4 className="font-body-md text-on-error-container">Mateo R.</h4>
                  <p className="font-body-md text-sm text-on-error-container/80 font-normal">
                    Dificultad en Secuencias
                  </p>
                </div>
              </div>
              <div className="w-full bg-surface-container rounded-full h-4 overflow-hidden mt-2 mb-3">
                <div
                  className="h-full bg-error rounded-full transition-all duration-1000"
                  style={{ width: "35%" }}
                ></div>
              </div>
              <button
                className="w-full bg-surface-container-lowest text-on-surface py-2 rounded-full font-body-md text-sm border border-outline-variant hover:bg-surface-variant transition-colors"
                onClick={() => handleOpenStudent(1)}
              >
                Ver Detalles
              </button>
            </div>

            <div className="bg-surface-container-highest border-2 border-outline-variant rounded-xl p-6 shadow-[0_4px_12px_rgba(0,103,130,0.08)] hover:border-secondary-container transition-colors">
              <div className="flex items-start gap-4 mb-2">
                <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex-shrink-0 overflow-hidden border border-outline-variant">
                  <img
                    alt="Student avatar"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQO9HeHZwW7vFl5MtrMDxOJii3_JqQLZgF0rlR9fvahiikzFbZ2dwT9c1pG1oxS5hIHsfsTdLxgbfUzDFMhHrYnN9I6SecJgA8A2KfuMJWi64NdNAwBVWowTYFLxOg8VsRTvGL8zGZdzy434vKD_A1RdHnAKyRFL6aCKzsCaNatauhCAjjG4PVSXbz9P-L96INSQwlCtyIhSk4FEwbK3cySa_aywhsKZ0Jtflb9abzesf-LPhJGjQvOo0qDpz2_CWL3OIXFLf5zeM"
                  />
                </div>
                <div>
                  <h4 className="font-body-md text-on-surface">Sofía L.</h4>
                  <p className="font-body-md text-sm text-on-surface-variant font-normal">
                    Inactividad (3 días)
                  </p>
                </div>
              </div>
              <button className="w-full mt-2 bg-surface text-on-surface py-2 rounded-full font-body-md text-sm border border-outline-variant hover:bg-surface-variant transition-colors">
                Enviar Recordatorio
              </button>
            </div>
          </div>

          {/* Right Column: Actividad Reciente */}
          <div className="lg:col-span-2">
            <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl shadow-[0_4px_12px_rgba(0,103,130,0.08)] overflow-hidden h-full flex flex-col">
              <div className="p-6 border-b-2 border-outline-variant bg-surface flex justify-between items-center">
                <h3 className="font-headline-md text-[24px] text-primary">
                  Actividad Reciente
                </h3>
                <button className="text-primary hover:bg-surface-container-high p-2 rounded-full transition-colors">
                  <span className="material-symbols-outlined">more_horiz</span>
                </button>
              </div>
              <div className="p-6 flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="text-on-surface-variant font-body-md border-b border-outline-variant/50">
                      <th className="pb-3 font-normal">Alumno</th>
                      <th className="pb-3 font-normal">Actividad</th>
                      <th className="pb-3 font-normal">Resultado</th>
                      <th className="pb-3 font-normal">Hora</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-md">
                    {/* Row 1 */}
                    <tr className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                      <td className="py-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container text-sm">
                          L
                        </div>
                        <span>Lucas M.</span>
                      </td>
                      <td className="py-3 text-on-surface-variant">Guía: Emociones Básicas</td>
                      <td className="py-3">
                        <span className="bg-primary-container/20 text-primary px-3 py-1 rounded-full text-sm">
                          Completado
                        </span>
                      </td>
                      <td className="py-3 text-on-surface-variant text-sm">Hace 10 min</td>
                    </tr>
                    {/* Row 2 */}
                    <tr className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                      <td className="py-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container text-sm">
                          A
                        </div>
                        <span>Ana P.</span>
                      </td>
                      <td className="py-3 text-on-surface-variant">Juego: Memoria Táctil</td>
                      <td className="py-3">
                        <span className="bg-secondary-fixed/50 text-on-surface px-3 py-1 rounded-full text-sm">
                          En Progreso
                        </span>
                      </td>
                      <td className="py-3 text-on-surface-variant text-sm">Hace 25 min</td>
                    </tr>
                    {/* Row 3 */}
                    <tr className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                      <td className="py-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-error-container flex items-center justify-center text-on-error-container text-sm">
                          M
                        </div>
                        <span>Mateo R.</span>
                      </td>
                      <td className="py-3 text-on-surface-variant">Guía: Secuencias</td>
                      <td className="py-3">
                        <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full text-sm">
                          Ayuda Requerida
                        </span>
                      </td>
                      <td className="py-3 text-on-surface-variant text-sm">Hace 1 hora</td>
                    </tr>
                    {/* Row 4 */}
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface text-sm">
                          D
                        </div>
                        <span>Diego S.</span>
                      </td>
                      <td className="py-3 text-on-surface-variant">Login Diario</td>
                      <td className="py-3">
                        <span className="bg-surface-variant text-on-surface px-3 py-1 rounded-full text-sm">
                          Iniciado
                        </span>
                      </td>
                      <td className="py-3 text-on-surface-variant text-sm">Hace 2 horas</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-on-background/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface-container-lowest w-full max-w-4xl rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden animate-pop-in border-2 border-outline-variant relative max-h-[90vh]">
            <button
              aria-label="Cerrar modal"
              className="absolute top-4 right-4 p-2 rounded-full bg-surface hover:bg-surface-variant text-on-surface transition-colors z-10"
              onClick={handleCloseStudent}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Left: Profile & Stats */}
            <div className="bg-surface-container-low p-8 md:w-1/3 flex flex-col items-center border-b md:border-b-0 md:border-r border-outline-variant">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-sm mb-6">
                <img
                  alt="Student avatar large"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAk9gyLyyPNRBZCwvGG_gGd2OvyRsVVp0kNhk-bIfWQRpAemXgsDz_JTr-W4SEYxjzHtZ1Z1NeoNxR3DjyIsRx0i435z8GatQd775chaquiQqgjubTYS4RuX-MmhshNS6VXVWMw4lJHQGZ6HDo4d_vg-zk614g-ogARahU-3pgWvd7xiWP5bSdreNxO8yOA7GdRBbZwhcVOVCo33WumXCc20c9JvOP1S2YGtGsQ8AmnDfmpRJHtd4Ys5bpsuNSnM7yKnGEJ-YO-47g"
                />
              </div>
              <h2 className="font-headline-md text-[28px] text-primary text-center">
                Mateo Rojas
              </h2>
              <p className="font-body-md text-label-lg text-on-surface-variant mb-6">
                Nivel 3 - Grupo B
              </p>
              <div className="w-full bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/50 mb-4 text-center">
                <p className="font-body-md text-sm text-on-surface-variant">
                  Progreso Global
                </p>
                <div className="font-headline-md text-[24px] text-primary">68%</div>
              </div>
              <button className="w-full mt-auto bg-primary text-on-primary py-3 rounded-full font-body-lg shadow-[0_4px_0_#004d63] hover:translate-y-1 hover:shadow-none transition-all active:scale-95">
                Planificar Refuerzo
              </button>
            </div>

            {/* Right: Details Lists */}
            <div className="p-8 md:w-2/3 flex flex-col gap-6 overflow-y-auto">
              <h3 className="font-headline-md text-[24px] text-on-surface mb-2">
                Análisis de Desempeño
              </h3>

              {/* Mastered */}
              <div className="bg-surface-container-high/30 p-6 rounded-xl border border-outline-variant/50">
                <h4 className="font-body-md text-[20px] text-primary flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">
                    check_circle
                  </span>
                  Habilidades Dominadas
                </h4>
                <ul className="space-y-2 font-body-md text-on-surface">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    Reconocimiento de colores primarios
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    Motricidad fina (Trazos simples)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    Asociación objeto-sonido básica
                  </li>
                </ul>
              </div>

              {/* Needs Reinforcement */}
              <div className="bg-error-container/30 p-6 rounded-xl border border-error/20">
                <h4 className="font-body-md text-[20px] text-error flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-error">flag</span>
                  Requiere Refuerzo
                </h4>
                <ul className="space-y-4 font-body-md text-on-surface">
                  <li className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-error"></div>
                      Secuencias Lógicas (3 pasos)
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden ml-6 w-[80%]">
                      <div
                        className="h-full bg-error rounded-full transition-all duration-1000"
                        style={{ width: "35%" }}
                      ></div>
                    </div>
                  </li>
                  <li className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-secondary-container"></div>
                      Concentración prolongada (&gt;5min)
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden ml-6 w-[80%]">
                      <div
                        className="h-full bg-secondary-container rounded-full transition-all duration-1000"
                        style={{ width: "50%" }}
                      ></div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
