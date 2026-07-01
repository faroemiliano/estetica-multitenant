import { useEffect, useState } from "react";
import {
  cancelarTurno,
  obtenerMisTurnos,
  ocultarTurno,
} from "../services/turnos";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function MisTurnosPage() {
  const { slug } = useParams();
  const [turnos, setTurnos] = useState<any[]>([]);
  const [pagina, setPagina] = useState(1);

  const porPagina = 3;
  const indexFin = pagina * porPagina;
  const indexInicio = indexFin - porPagina;

  const turnosPaginados = turnos.slice(indexInicio, indexFin);

  const totalPaginas = Math.ceil(turnos.length / porPagina);

  useEffect(() => {
    cargar();
    setPagina(1);
  }, []);

  const cargar = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const data = await obtenerMisTurnos(token);
    console.log(data);
    setTurnos(data);
  };

  const handleCancelar = async (turnoId: number) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    await cancelarTurno(token, turnoId);

    cargar();
  };

  const handleEliminar = async (turnoId: number) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    await ocultarTurno(token, turnoId);

    cargar();
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
    <div className="flex min-h-screen justify-center bg-[#f7f4f2] px-4 py-14">
      <div className="flex w-full max-w-6xl flex-col items-center gap-10">
        {/* HEADER */}
        <div className="flex flex-col items-center text-center">
          <h1 className="max-w-2xl text-4xl font-bold text-gray-900 md:text-5xl">
            Mis Turnos
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-500">
            Administrá fácilmente todas tus reservas y mantené el control de tus
            próximos servicios.
          </p>
        </div>

        {/* BOTONES */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to={`/${slug}/dashboard`}
            className="rounded-2xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-300 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 hover:shadow-lg"
          >
            Volver a Obtener Turno
          </Link>

          <Link
            to={`/${slug}`}
            className="rounded-2xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Ir al Inicio
          </Link>

          <Link
            to={`/${slug}/historial`}
            className="rounded-2xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            🗄️ Historial
          </Link>
        </div>

        {/* EMPTY */}
        {turnos.length === 0 ? (
          <div className="flex w-full max-w-3xl flex-col items-center justify-center rounded-[32px] border border-dashed border-gray-300 bg-white px-8 py-20 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800">
              No tenés turnos todavía
            </h2>

            <p className="mt-3 max-w-md text-gray-500">
              Cuando reserves un servicio, tus turnos aparecerán acá.
            </p>
          </div>
        ) : (
          <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {turnosPaginados.map((t: any) => (
              <div
                key={t.id}
                className="group relative overflow-hidden rounded-[32px] border border-white/60 bg-white/90 p-7 shadow-[0_10px_40px_rgba(0,0,0,0.05)] backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
              >
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 opacity-0 transition duration-500 group-hover:opacity-100" />

                <div className="relative z-10 flex h-full flex-col items-center text-center">
                  {/* FECHA */}
                  <div className="mb-5 rounded-full bg-black px-5 py-2 text-sm font-semibold tracking-wide text-white shadow-lg">
                    {new Date(t.hora_inicio).toLocaleDateString("es-AR", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>

                  {/* HORARIO */}
                  <h2 className="text-3xl font-bold text-gray-900">
                    {new Date(t.hora_inicio).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    hasta{" "}
                    {new Date(t.hora_fin).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  {/* SERVICIO */}
                  <div className="mt-6 flex flex-col items-center">
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
                      Servicio
                    </span>

                    <p className="mt-2 text-xl font-semibold text-gray-800">
                      {t.servicio?.nombre}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col items-center">
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
                      Profesional
                    </span>

                    <p className="mt-2 font-medium text-gray-700">
                      {t.profesional?.nombre || "Sin asignar"}
                    </p>
                  </div>

                  {/* ESTADO */}
                  <div className="mt-6">
                    <span
                      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${getEstadoColor(
                        t.estado,
                      )}`}
                    >
                      {t.estado}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-5 flex w-full flex-col gap-3">
                    {/* CANCELAR */}
                    <button
                      onClick={() => {
                        const ok = window.confirm(
                          "¿Querés cancelar este turno?",
                        );
                        if (ok) handleCancelar(t.id);
                      }}
                      disabled={
                        t.estado === "cancelado" || t.estado === "finalizado"
                      }
                      className={`w-full rounded-2xl py-3 text-sm font-semibold text-white transition
      ${
        t.estado === "cancelado" || t.estado === "finalizado"
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-red-500 hover:bg-red-600"
      }
    `}
                    >
                      Cancelar turno
                    </button>

                    {/* ARCHIVAR (SIEMPRE DISPONIBLE) */}
                    <button
                      onClick={() => {
                        const ok = window.confirm(
                          "¿Querés archivar este turno?",
                        );
                        if (ok) handleEliminar(t.id);
                      }}
                      className="w-full rounded-2xl bg-gray-700 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition"
                    >
                      Archivar turno
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {turnos.length > porPagina && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => setPagina((p) => Math.max(p - 1, 1))}
              disabled={pagina === 1}
              className="rounded-xl bg-gray-200 px-4 py-2 text-sm font-semibold disabled:opacity-40"
            >
              Anterior
            </button>

            <span className="text-sm font-semibold text-gray-700">
              Página {pagina} de {totalPaginas}
            </span>

            <button
              onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))}
              disabled={pagina === totalPaginas}
              className="rounded-xl bg-gray-200 px-4 py-2 text-sm font-semibold disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MisTurnosPage;
