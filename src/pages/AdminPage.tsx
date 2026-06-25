import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CrearServicioForm from "../components/admin/CrearServicioForm";
import ListaServicios from "../components/admin/ListarServicios";
import ListaTurnos from "../components/admin/ListarTurnos";
import CalendarioTurnos from "../components/admin/CalendarioTurno";

import AdminLayout from "../components/layout/AdminLayout";

import { obtenerServicios } from "../services/servicios";
import { obtenerStats } from "../services/dashboard";

import { useParams } from "react-router-dom";

const api = import.meta.env.VITE_API_URL;

function AdminPage() {
  const { slug } = useParams();
  const [servicios, setServicios] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  const [cumpleaneros, setCumpleaneros] = useState<any[]>([]);

  const [profesionales, setProfesionales] = useState<any[]>([]);

  const [mostrarServicios, setMostrarServicios] = useState(false);

  const [mostrarTurnos, setMostrarTurnos] = useState(false);

  const navigate = useNavigate();

  const cargarStats = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const data = await obtenerStats(token);

    setStats(data);
  };

  const cargarServicios = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const data = await obtenerServicios(token);

    setServicios(data);
  };

  const cargarProfesionales = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/profesionales`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProfesionales(response.data);
    } catch (error) {
      console.log(error);
    }
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
    cargarServicios();
    cargarStats();
    cargarProfesionales();
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
      {/* HEADER */}
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-black text-gray-900">Panel Admin</h1>
        <p className="text-sm text-gray-500">Gestión rápida de tu estética</p>
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 ">
        {/* STATS */}
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3">
          {/* STATS */}
          <div className="grid grid-cols-5 gap-2">
            {[
              { label: "Hoy", value: stats.turnos_hoy },
              { label: "Pendiente", value: stats.pendientes },
              { label: "confirmado", value: stats.confirmados },
              { label: "Cancelado", value: stats.cancelados },
              { label: "Fin", value: stats.finalizados },
            ].map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center rounded-xl bg-white py-2 shadow-sm"
              >
                <p className="text-[15px] text-gray-500">{s.label}</p>
                <h2 className="text-sm font-bold leading-none">{s.value}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* CALENDARIO */}
        <div className="rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100">
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xs font-semibold text-gray-700 flex items-center gap-1">
              📅 Calendario
            </h2>
          </div>

          {/* CONTENIDO */}
          <div className="max-h-[360px] overflow-y-auto p-2">
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
                  href={`https://wa.me/${c.telefono}?text=Feliz cumpleaños ${c.nombre_completo}! 🎂`}
                  target="_blank"
                >
                  WhatsApp
                </a>
              </div>
            ))}
          </div>
        )}

        {/* ACTION GRID */}
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {[
            {
              label: "👩‍⚕️ Profesionales",
              color: "bg-emerald-600",
              action: () => navigate(`/${slug}/admin/profesionales`),
            },
            {
              label: "🧾 Servicios",
              color: "bg-black",
              action: () => setMostrarServicios(true),
            },
            {
              label: "📅 Turnos",
              color: "bg-gray-800",
              action: () => setMostrarTurnos(true),
            },
            {
              label: "👥 Clientes",
              color: "bg-pink-600",
              action: () => navigate(`/${slug}/admin/clientes`),
            },
            {
              label: "⚙️ Config",
              color: "bg-blue-600",
              action: () => navigate(`/${slug}/admin/config`),
            },
            {
              label: "⏰ Horarios",
              color: "bg-violet-600",
              action: () => navigate(`/${slug}/admin/horarios`),
            },
          ].map((b, i) => (
            <button
              key={i}
              onClick={b.action}
              className={`${b.color} rounded-2xl p-4 text-sm font-bold text-white shadow-sm active:scale-95 transition`}
            >
              {b.label}
            </button>
          ))}

          <button
            onClick={() => navigate(`/${slug}`)}
            className="col-span-2 rounded-2xl border border-gray-300 bg-white p-4 text-sm font-bold text-gray-700 active:scale-95 transition"
          >
            🏠 Ver página pública
          </button>
        </div>
      </div>

      {/* MODAL SERVICIOS */}
      {mostrarServicios && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 flex items-end md:items-center justify-center">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4">
              <h2 className="text-lg font-bold">Servicios</h2>
              <button onClick={() => setMostrarServicios(false)}>Cerrar</button>
            </div>

            <div className="p-4 space-y-4">
              <CrearServicioForm recargarServicios={cargarServicios} />

              <ListaServicios
                servicios={servicios}
                recargarServicios={cargarServicios}
                profesionales={profesionales}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL TURNOS */}
      {mostrarTurnos && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 flex items-end md:items-center justify-center">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4">
              <h2 className="text-lg font-bold">Turnos</h2>
              <button onClick={() => setMostrarTurnos(false)}>Cerrar</button>
            </div>

            <div className="p-4">
              <ListaTurnos />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminPage;
