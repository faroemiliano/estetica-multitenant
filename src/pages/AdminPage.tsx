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

function AdminPage() {
  const { slug } = useParams();
  const [servicios, setServicios] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

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

  useEffect(() => {
    cargarServicios();
    cargarStats();
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
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <h1 className="text-center text-3xl font-bold text-gray-800">
          Panel Admin
        </h1>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <div className="rounded-xl bg-white p-4 text-center shadow-sm">
            <p className="text-xs text-gray-500">Turnos Hoy</p>

            <h2 className="text-2xl font-bold">{stats.turnos_hoy}</h2>
          </div>

          <div className="rounded-xl bg-white p-4 text-center shadow-sm">
            <p className="text-xs text-gray-500">Pendientes</p>

            <h2 className="text-2xl font-bold">{stats.pendientes}</h2>
          </div>

          <div className="rounded-xl bg-white p-4 text-center shadow-sm">
            <p className="text-xs text-gray-500">Confirmados</p>

            <h2 className="text-2xl font-bold">{stats.confirmados}</h2>
          </div>

          <div className="rounded-xl bg-white p-4 text-center shadow-sm">
            <p className="text-xs text-gray-500">Cancelados</p>

            <h2 className="text-2xl font-bold">{stats.cancelados}</h2>
          </div>

          <div className="rounded-xl bg-white p-4 text-center shadow-sm">
            <p className="text-xs text-gray-500">Finalizados</p>

            <h2 className="text-2xl font-bold">{stats.finalizados}</h2>
          </div>
        </div>

        {/* CALENDARIO */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <CalendarioTurnos />
        </div>

        {/* BOTONES */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate(`/${slug}/admin/profesionales`)}
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white"
          >
            Profesionales
          </button>
          <button
            onClick={() => setMostrarServicios(true)}
            className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
          >
            Mis Servicios
          </button>

          <button
            onClick={() => setMostrarTurnos(true)}
            className="rounded-xl bg-gray-800 px-5 py-3 text-sm font-medium text-white"
          >
            Ver Turnos
          </button>
          <button
            onClick={() => navigate(`/${slug}/admin/clientes`)}
            className="rounded-xl bg-pink-600 px-5 py-3 text-sm font-medium text-white"
          >
            Ver Clientes
          </button>
          <button
            onClick={() => navigate(`/${slug}/admin/config`)}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white"
          >
            Configuración
          </button>

          <button
            onClick={() => navigate(`/${slug}/admin/horarios`)}
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white"
          >
            Horarios de Atención
          </button>
        </div>

        {/* MODAL SERVICIOS */}
        {mostrarServicios && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Servicios</h2>

                <button
                  onClick={() => setMostrarServicios(false)}
                  className="rounded-lg bg-gray-100 px-4 py-2"
                >
                  Cerrar
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-gray-200 p-4">
                  <CrearServicioForm recargarServicios={cargarServicios} />
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <ListaServicios
                    servicios={servicios}
                    recargarServicios={cargarServicios}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL TURNOS */}
        {mostrarTurnos && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Turnos</h2>

                <button
                  onClick={() => setMostrarTurnos(false)}
                  className="rounded-lg bg-gray-100 px-4 py-2"
                >
                  Cerrar
                </button>
              </div>

              <ListaTurnos />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminPage;
