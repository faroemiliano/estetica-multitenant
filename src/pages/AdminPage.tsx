import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BarChart3,
  CalendarDays,
  Clock3,
  Eye,
  LayoutDashboard,
  Scissors,
  Settings,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

import CalendarioTurnos from "../components/admin/CalendarioTurno";
import AdminLayout from "../components/layout/AdminLayout";
import { obtenerStats } from "../services/dashboard";

const api = import.meta.env.VITE_API_URL;

type Estadisticas = {
  turnos_hoy: number;
  pendientes: number;
  confirmados: number;
  cancelados: number;
  finalizados: number;
};

type Cumpleanero = {
  id: number;
  nombre_completo: string;
  telefono?: string;
};

type Acceso = {
  icono: LucideIcon;
  nombre: string;
  ruta: string;
};

function AdminPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [cumpleaneros, setCumpleaneros] = useState<Cumpleanero[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    Promise.all([
      obtenerStats(token),
      axios.get(`${api}/clientes/cumpleanios`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([estadisticas, respuestaCumpleanios]) => {
        setStats(estadisticas);
        setCumpleaneros(
          Array.isArray(respuestaCumpleanios.data)
            ? respuestaCumpleanios.data
            : [],
        );
      })
      .catch(() => setError("No pudimos cargar el resumen del panel."));
  }, []);

  const accesos: Acceso[] = [
    { icono: CalendarDays, nombre: "Turnos", ruta: `/${slug}/admin/turnos` },
    { icono: Users, nombre: "Clientes", ruta: `/${slug}/admin/clientes` },
    { icono: Scissors, nombre: "Servicios", ruta: `/${slug}/admin/servicios` },
    { icono: UserRound, nombre: "Profesionales", ruta: `/${slug}/admin/profesionales` },
    { icono: Clock3, nombre: "Horarios", ruta: `/${slug}/admin/horarios` },
    { icono: Settings, nombre: "Configuración", ruta: `/${slug}/admin/config` },
  ];

  const metricas = stats
    ? [
        { nombre: "Turnos de hoy", valor: stats.turnos_hoy, estilo: "border-pink-300" },
        { nombre: "Pendientes", valor: stats.pendientes, estilo: "border-amber-200" },
        { nombre: "Confirmados", valor: stats.confirmados, estilo: "border-emerald-200" },
        { nombre: "Finalizados", valor: stats.finalizados, estilo: "border-stone-300" },
      ]
    : [];

  return (
    <AdminLayout>
      <div className="flex w-full flex-col gap-6 lg:flex-row">
        <aside className="h-fit rounded-3xl bg-gray-950 p-5 text-white shadow-xl lg:sticky lg:top-6 lg:w-64 lg:shrink-0">
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-600 text-lg font-black">A</div>
            <div>
              <p className="font-black">Aura Estética</p>
              <p className="text-xs text-gray-400">Administración</p>
            </div>
          </div>

          <nav className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
            <button className="flex items-center gap-3 rounded-xl bg-pink-600 px-4 py-3 text-left text-sm font-bold text-white">
              <LayoutDashboard size={18} /> Resumen
            </button>
            {accesos.map(({ icono: Icono, nombre, ruta }) => (
              <button
                key={nombre}
                onClick={() => navigate(ruta)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-gray-300 hover:bg-white/10 hover:text-white"
              >
                <Icono size={18} /> {nombre}
              </button>
            ))}
          </nav>

          <button
            onClick={() => navigate(`/${slug}`)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-gray-200 hover:bg-white/10"
          >
            <Eye size={17} /> Ver página pública
          </button>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-pink-600">
                <BarChart3 size={17} /> Administración
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                Panel principal
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Tu agenda y las herramientas de Aura en un solo lugar.
              </p>
            </div>
            <button
              onClick={() => navigate(`/${slug}/admin/turnos`)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-pink-700"
            >
              <CalendarDays size={18} /> Anotar un turno
            </button>
          </header>

          {error && (
            <p className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
              {error}
            </p>
          )}

          {!stats ? (
            <div className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-28 animate-pulse rounded-2xl bg-white" />
              ))}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
              {metricas.map((metrica) => (
                <article
                  key={metrica.nombre}
                  className={`rounded-2xl border bg-white p-5 shadow-sm ${metrica.estilo}`}
                >
                  <p className="text-sm font-semibold text-gray-500">{metrica.nombre}</p>
                  <p className="mt-2 text-3xl font-black text-gray-900">{metrica.valor}</p>
                </article>
              ))}
            </div>
          )}

          <section className="mt-8 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-5 sm:px-6">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black text-gray-900">
                  <CalendarDays className="text-pink-600" size={21} /> Agenda de turnos
                </h2>
                <p className="mt-1 text-sm text-gray-500">Consultá y organizá las próximas reservas.</p>
              </div>
            </div>
            <div className="p-2 sm:p-4">
              <CalendarioTurnos />
            </div>
          </section>

          {cumpleaneros.length > 0 && (
            <section className="mt-6 rounded-3xl border border-rose-200 bg-rose-100 p-5 sm:p-6">
              <h2 className="font-black text-rose-900">🎂 Cumpleaños de hoy</h2>
              <p className="mt-1 text-sm text-rose-700">Saludá a tus clientes desde WhatsApp.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {cumpleaneros.map((cliente) => (
                  <div key={cliente.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/80 p-4">
                    <span className="text-sm font-bold text-gray-800">{cliente.nombre_completo}</span>
                    {cliente.telefono && (
                      <a
                        href={`https://wa.me/${cliente.telefono}?text=${encodeURIComponent(`¡Feliz cumpleaños, ${cliente.nombre_completo}! Todo el equipo de Aura Estética te desea un hermoso día.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-bold text-pink-700 hover:text-pink-900"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminPage;
