import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarioTurnos from "../components/admin/CalendarioTurno";

import AdminLayout from "../components/layout/AdminLayout";

import { obtenerStats } from "../services/dashboard";

import { useParams } from "react-router-dom";

const api = import.meta.env.VITE_API_URL;

function AdminPage() {
  const { slug } = useParams();
  const [stats, setStats] = useState<any>(null);

  const [cumpleaneros, setCumpleaneros] = useState<any[]>([]);

  const navigate = useNavigate();

  const cargarStats = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const data = await obtenerStats(token);

    setStats(data);
  };

  const cargarCumpleaneros = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${api}/clientes/cumpleanios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCumpleaneros(response.data);
    console.log(response.data);
  };

  useEffect(() => {
    cargarStats();
    cargarCumpleaneros();
  }, []);

  if (!stats) {
    return (
      <AdminLayout>
        <p className="text-lg">Cargando...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-pink-600">Administración</p>
          <h1 className="mt-1 text-3xl font-black text-gray-900">Panel principal</h1>
          <p className="mt-2 text-sm text-gray-500">
            Consultá la agenda y administrá tu estética desde un solo lugar.
          </p>
        </div>
        <button
          onClick={() => navigate(`/${slug}`)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          Ver página pública
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        {/* STATS */}
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {[
              { label: "Turnos de hoy", value: stats.turnos_hoy, color: "border-pink-200" },
              { label: "Pendientes", value: stats.pendientes, color: "border-amber-200" },
              { label: "Confirmados", value: stats.confirmados, color: "border-emerald-200" },
              { label: "Cancelados", value: stats.cancelados, color: "border-red-200" },
              { label: "Finalizados", value: stats.finalizados, color: "border-gray-300" },
            ].map((s, i) => (
              <div
                key={i}
                className={`rounded-2xl border-l-4 bg-white p-4 shadow-sm ${s.color}`}
              >
                <p className="text-xs font-semibold text-gray-500">{s.label}</p>
                <h2 className="mt-2 text-2xl font-black text-gray-900">{s.value}</h2>
              </div>
            ))}
          </div>
        </div>

        <section>
          <div className="mb-3">
            <h2 className="text-xl font-bold text-gray-900">Accesos rápidos</h2>
            <p className="text-sm text-gray-500">Elegí qué querés administrar.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "📅", label: "Turnos", detail: "Anotar, confirmar o cancelar", action: () => navigate(`/${slug}/admin/turnos`) },
              { icon: "👥", label: "Clientes", detail: "Buscar clientes registrados", action: () => navigate(`/${slug}/admin/clientes`) },
              { icon: "🧾", label: "Servicios", detail: "Crear y editar servicios", action: () => navigate(`/${slug}/admin/servicios`) },
              { icon: "👩‍⚕️", label: "Profesionales", detail: "Equipo y disponibilidad", action: () => navigate(`/${slug}/admin/profesionales`) },
              { icon: "⏰", label: "Horarios", detail: "Configurar días y horas", action: () => navigate(`/${slug}/admin/horarios`) },
              { icon: "⚙️", label: "Configuración", detail: "Datos de la estética", action: () => navigate(`/${slug}/admin/config`) },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-xl">
                  {item.icon}
                </span>
                <span className="min-w-0">
                  <span className="block font-bold text-gray-900">{item.label}</span>
                  <span className="mt-1 block text-xs text-gray-500">{item.detail}</span>
                </span>
                <span className="ml-auto text-gray-300">›</span>
              </button>
            ))}
          </div>
        </section>

        {/* CALENDARIO */}
        <div className="rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100">
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              📅 Agenda de turnos
            </h2>
          </div>

          {/* CONTENIDO */}
          <div className="p-2">
            <CalendarioTurnos />
          </div>
        </div>

        {/* CUMPLEAÑOS */}
        {cumpleaneros.length > 0 && (
          <div className="rounded-2xl border border-pink-200 bg-pink-50 p-3 text-sm">
            <h2 className="mb-3 font-bold text-pink-700">
              🎂 Cumpleaños de hoy
            </h2>

            {cumpleaneros.map((c: any) => (
              <div
                key={c.id}
                className="flex items-center justify-between py-1"
              >
                <span className="text-sm">{c.nombre_completo}</span>

                <a
                  className="text-sm font-semibold text-pink-600"
                  href={`https://wa.me/${c.telefono}?text=${encodeURIComponent(
                    `¡Feliz cumpleaños, ${c.nombre_completo}! 

Todo el equipo de Aura Estética te desea un día lleno de alegría, bienestar y momentos especiales.

Gracias por confiar en nosotros. Esperamos verte pronto para seguir acompañándote en tu cuidado y belleza. 

¡Que tengas un excelente cumpleaños! `,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </div>
            ))}
          </div>
        )}

      </div>

    </AdminLayout>
  );
}

export default AdminPage;
