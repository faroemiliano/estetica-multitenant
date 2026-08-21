import { useEffect, useState } from "react";

import { obtenerTurnosAdmin, cambiarEstadoTurno } from "../../services/turnos";

import { Check, X, CheckCheck } from "lucide-react";
import CrearTurnoAdmin from "./CrearTurnoAdmin";

function ListaTurnos() {
  const [turnos, setTurnos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("todos");
  const [pagina, setPagina] = useState(1);
  const porPagina = 8;

  useEffect(() => {
    cargarTurnos();
  }, []);

  const cargarTurnos = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const data = await obtenerTurnosAdmin(token);

    setTurnos(
      data.sort((a: any, b: any) => {
        return (
          new Date(a.hora_inicio).getTime() - new Date(b.hora_inicio).getTime()
        );
      }),
    );
  };

  const handleEstado = async (turnoId: number, estado: string) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    await cambiarEstadoTurno(token, turnoId, estado);

    cargarTurnos();
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "confirmado":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";

      case "cancelado":
        return "bg-red-100 text-red-700 border border-red-200";

      case "finalizado":
        return "bg-gray-200 text-gray-700 border border-gray-300";

      default:
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }
  };

  const turnosFiltrados = turnos.filter((turno) => {
    const texto = `${turno.cliente?.nombre_completo || ""} ${turno.cliente?.email || ""} ${turno.servicio?.nombre || ""}`.toLowerCase();
    const coincideBusqueda = texto.includes(busqueda.toLowerCase().trim());
    const coincideEstado = estado === "todos" || turno.estado === estado;
    return coincideBusqueda && coincideEstado;
  });

  const totalPaginas = Math.max(
    1,
    Math.ceil(turnosFiltrados.length / porPagina),
  );
  const paginaActual = Math.min(pagina, totalPaginas);
  const turnosPagina = turnosFiltrados.slice(
    (paginaActual - 1) * porPagina,
    paginaActual * porPagina,
  );

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-7xl flex-col gap-6">
        <CrearTurnoAdmin onCreado={cargarTurnos} />

        {/* HEADER */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Turnos registrados</h2>
          <p className="mt-1 text-sm text-gray-500">
            Buscá un turno o filtralo por estado.
          </p>
        </div>

        <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_220px]">
          <input
            value={busqueda}
            onChange={(event) => {
              setBusqueda(event.target.value);
              setPagina(1);
            }}
            placeholder="Buscar cliente, email o servicio"
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-400"
          />
          <select
            value={estado}
            onChange={(event) => {
              setEstado(event.target.value);
              setPagina(1);
            }}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="confirmado">Confirmados</option>
            <option value="cancelado">Cancelados</option>
            <option value="finalizado">Finalizados</option>
          </select>
        </div>

        {/* EMPTY */}
        {turnosFiltrados.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white px-8 py-16 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-gray-800">
              No encontramos turnos
            </h3>

            <p className="mt-3 max-w-md text-gray-500">
              Probá cambiando la búsqueda o el filtro seleccionado.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
            {/* TABLE HEADER */}
            <div className="hidden grid-cols-[1.2fr_1fr_0.8fr_0.8fr_1.3fr] border-b border-gray-100 bg-gray-50 px-8 py-5 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 lg:grid">
              <span>Cliente</span>
              <span>Servicio</span>
              <span>Fecha</span>
              <span>Hora</span>
              <span className="text-center">Acciones</span>
            </div>

            {/* ROWS */}
            <div className="flex flex-col divide-y divide-gray-100">
              {turnosPagina.map((turno) => (
                <div
                  key={turno.id}
                  className="group transition duration-300 hover:bg-[#fcfcfc]"
                >
                  {/* DESKTOP */}
                  <div className="hidden grid-cols-[1.2fr_1fr_0.8fr_0.8fr_1.3fr] items-center gap-6 px-8 py-6 lg:grid">
                    {/* CLIENTE */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-sm font-bold text-pink-700">
                          {turno.cliente?.email?.charAt(0)?.toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-base font-semibold text-gray-900">
                            {turno.cliente?.email}
                          </h3>

                          <div className="mt-2">
                            <span
                              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${getEstadoColor(
                                turno.estado,
                              )}`}
                            >
                              {turno.estado}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SERVICIO */}
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-gray-800">
                        {turno.servicio?.nombre}
                      </p>
                    </div>

                    {/* FECHA */}
                    <div>
                      <div className="rounded-2xl bg-gray-100 px-4 py-3 text-center font-semibold text-gray-700">
                        {new Date(turno.hora_inicio).toLocaleDateString()}
                      </div>
                    </div>

                    {/* HORA */}
                    <div>
                      <div className="rounded-2xl bg-pink-900 px-4 py-3 text-center font-semibold text-white">
                        {new Date(turno.hora_inicio).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEstado(turno.id, "confirmado")}
                        title="Confirmar"
                        className="rounded-full bg-emerald-100 p-3 text-emerald-600 transition hover:bg-emerald-600 hover:text-white"
                      >
                        <Check size={18} />
                      </button>

                      <button
                        onClick={() => handleEstado(turno.id, "cancelado")}
                        title="Cancelar"
                        className="rounded-full bg-red-100 p-3 text-red-600 transition hover:bg-red-600 hover:text-white"
                      >
                        <X size={18} />
                      </button>

                      <button
                        onClick={() => handleEstado(turno.id, "finalizado")}
                        title="Finalizar"
                        className="rounded-full bg-gray-100 p-3 text-gray-700 transition hover:bg-gray-800 hover:text-white"
                      >
                        <CheckCheck size={18} />
                      </button>
                    </div>
                  </div>

                  {/* MOBILE */}
                  <div className="flex flex-col gap-6 p-6 lg:hidden">
                    {/* TOP */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-bold text-gray-900">
                          {turno.cliente?.email}
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                          {turno.servicio?.nombre}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${getEstadoColor(
                          turno.estado,
                        )}`}
                      >
                        {turno.estado}
                      </span>
                    </div>

                    {/* INFO */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-gray-100 p-4 text-center">
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Fecha
                        </p>

                        <h4 className="mt-2 font-semibold text-gray-800">
                          {new Date(turno.hora_inicio).toLocaleDateString()}
                        </h4>
                      </div>

                      <div className="rounded-2xl bg-pink-900 p-4 text-center">
                        <p className="text-xs uppercase tracking-wide text-white/60">
                          Hora
                        </p>

                        <h4 className="mt-2 font-semibold text-white">
                          {new Date(turno.hora_inicio).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </h4>
                      </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleEstado(turno.id, "confirmado")}
                        title="Confirmar"
                        className="rounded-full bg-emerald-100 p-4 text-emerald-600 transition hover:bg-emerald-600 hover:text-white"
                      >
                        <Check size={22} />
                      </button>

                      <button
                        onClick={() => handleEstado(turno.id, "cancelado")}
                        title="Cancelar"
                        className="rounded-full bg-red-100 p-4 text-red-600 transition hover:bg-red-600 hover:text-white"
                      >
                        <X size={22} />
                      </button>

                      <button
                        onClick={() => handleEstado(turno.id, "finalizado")}
                        title="Finalizar"
                        className="rounded-full bg-gray-100 p-4 text-gray-700 transition hover:bg-gray-800 hover:text-white"
                      >
                        <CheckCheck size={22} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row">
              <p className="text-sm text-gray-500">
                Mostrando {turnosPagina.length} de {turnosFiltrados.length} turnos
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={paginaActual === 1}
                  onClick={() => setPagina((actual) => Math.max(1, actual - 1))}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold disabled:opacity-40"
                >
                  Anterior
                </button>
                <span className="px-2 text-sm font-semibold text-gray-700">
                  {paginaActual} / {totalPaginas}
                </span>
                <button
                  type="button"
                  disabled={paginaActual === totalPaginas}
                  onClick={() =>
                    setPagina((actual) => Math.min(totalPaginas, actual + 1))
                  }
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListaTurnos;
