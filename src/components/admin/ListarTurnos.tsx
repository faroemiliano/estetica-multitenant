import { useEffect, useState } from "react";

import { obtenerTurnosAdmin, cambiarEstadoTurno } from "../../services/turnos";

function ListaTurnos() {
  const [turnos, setTurnos] = useState<any[]>([]);

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

  return (
    <div className="flex w-full justify-center bg-[#f8f6f4]">
      <div className="flex w-full max-w-7xl flex-col gap-8">
        {/* HEADER */}
        <div className="flex flex-col items-center text-center">
          <span className="mb-4 rounded-full bg-black px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white">
            Gestión
          </span>

          <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Turnos de clientes
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-500">
            Administrá reservas, confirmaciones y cancelaciones desde un único
            lugar.
          </p>
        </div>

        {/* EMPTY */}
        {turnos.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[36px] border border-dashed border-gray-300 bg-white px-8 py-16 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-gray-800">
              No hay turnos registrados
            </h3>

            <p className="mt-3 max-w-md text-gray-500">
              Los próximos turnos reservados por tus clientes aparecerán acá.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[36px] border border-gray-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
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
              {turnos.map((turno) => (
                <div
                  key={turno.id}
                  className="group transition duration-300 hover:bg-[#fcfcfc]"
                >
                  {/* DESKTOP */}
                  <div className="hidden grid-cols-[1.2fr_1fr_0.8fr_0.8fr_1.3fr] items-center gap-6 px-8 py-6 lg:grid">
                    {/* CLIENTE */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
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
                      <div className="rounded-2xl bg-black px-4 py-3 text-center font-semibold text-white">
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
                        className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition hover:scale-[1.03] hover:bg-emerald-600"
                      >
                        Confirmar
                      </button>

                      <button
                        onClick={() => handleEstado(turno.id, "cancelado")}
                        className="rounded-xl bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:scale-[1.03] hover:bg-red-600"
                      >
                        Cancelar
                      </button>

                      <button
                        onClick={() => handleEstado(turno.id, "finalizado")}
                        className="rounded-xl bg-gray-800 px-4 py-2 text-xs font-semibold text-white transition hover:scale-[1.03] hover:bg-black"
                      >
                        Finalizar
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

                      <div className="rounded-2xl bg-black p-4 text-center">
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
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <button
                        onClick={() => handleEstado(turno.id, "confirmado")}
                        className="rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                      >
                        Confirmar
                      </button>

                      <button
                        onClick={() => handleEstado(turno.id, "cancelado")}
                        className="rounded-2xl bg-red-500 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                      >
                        Cancelar
                      </button>

                      <button
                        onClick={() => handleEstado(turno.id, "finalizado")}
                        className="rounded-2xl bg-gray-800 py-3 text-sm font-semibold text-white transition hover:bg-black"
                      >
                        Finalizar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListaTurnos;
