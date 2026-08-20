import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  ArrowLeft,
  CalendarDays,
  Clock3,
  History,
  Plus,
  UserRound,
  X,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  cancelarTurno,
  obtenerMisTurnos,
  ocultarTurno,
} from "../services/turnos";

type Turno = {
  id: number;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  servicio?: { nombre?: string };
  profesional?: { nombre?: string };
};

const estadoEstilo: Record<string, string> = {
  confirmado: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelado: "border-red-200 bg-red-50 text-red-700",
  finalizado: "border-gray-200 bg-gray-100 text-gray-600",
  pendiente: "border-amber-200 bg-amber-50 text-amber-700",
};

function MisTurnosPage() {
  const { slug } = useParams();
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [filtro, setFiltro] = useState("todos");
  const [pagina, setPagina] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState<number | null>(null);
  const porPagina = 6;

  const cargar = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const data = await obtenerMisTurnos(token);
      setTurnos(Array.isArray(data) ? data : []);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargar();
  }, []);

  const turnosFiltrados = useMemo(
    () =>
      filtro === "todos"
        ? turnos
        : turnos.filter((turno) => turno.estado === filtro),
    [filtro, turnos],
  );
  const totalPaginas = Math.max(
    1,
    Math.ceil(turnosFiltrados.length / porPagina),
  );
  const paginaActual = Math.min(pagina, totalPaginas);
  const turnosPagina = turnosFiltrados.slice(
    (paginaActual - 1) * porPagina,
    paginaActual * porPagina,
  );

  const handleCancelar = async (turnoId: number) => {
    if (!window.confirm("¿Querés cancelar este turno?")) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    setProcesando(turnoId);
    try {
      await cancelarTurno(token, turnoId);
      await cargar();
    } finally {
      setProcesando(null);
    }
  };

  const handleArchivar = async (turnoId: number) => {
    if (!window.confirm("¿Querés archivar este turno?")) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    setProcesando(turnoId);
    try {
      await ocultarTurno(token, turnoId);
      await cargar();
    } finally {
      setProcesando(null);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
          <Link
            to={`/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft size={17} /> Volver al inicio
          </Link>
          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-pink-600">
                <CalendarDays size={17} /> Tus reservas
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
                Mis turnos
              </h1>
              <p className="mt-4 max-w-2xl text-gray-500">
                Consultá los detalles, cancelá una reserva o archivá turnos que ya no necesitás ver.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/${slug}/historial`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 shadow-sm hover:border-pink-200 hover:bg-pink-50 hover:text-pink-700"
              >
                <History size={18} /> Ver archivados
              </Link>
              <Link
                to={`/${slug}/dashboard`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-pink-700"
              >
                <Plus size={18} /> Reservar otro turno
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex gap-2 overflow-x-auto rounded-2xl border border-stone-200 bg-white p-3 shadow-sm">
          {[
            ["todos", "Todos"],
            ["pendiente", "Pendientes"],
            ["confirmado", "Confirmados"],
            ["finalizado", "Finalizados"],
            ["cancelado", "Cancelados"],
          ].map(([valor, nombre]) => (
            <button
              key={valor}
              onClick={() => {
                setFiltro(valor);
                setPagina(1);
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                filtro === valor
                  ? "bg-pink-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-700"
              }`}
            >
              {nombre}
            </button>
          ))}
        </div>

        {cargando ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-80 animate-pulse rounded-3xl bg-white" />
            ))}
          </div>
        ) : turnosPagina.length ? (
          <>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {turnosPagina.map((turno) => {
                const inicio = new Date(turno.hora_inicio);
                const fin = new Date(turno.hora_fin);
                const bloqueado =
                  turno.estado === "cancelado" || turno.estado === "finalizado";
                return (
                  <article
                    key={turno.id}
                    className="flex flex-col rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-pink-200 hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
                          estadoEstilo[turno.estado] || estadoEstilo.pendiente
                        }`}
                      >
                        {turno.estado}
                      </span>
                      <span className="text-xs font-semibold text-gray-400">
                        #{turno.id}
                      </span>
                    </div>

                    <h2 className="mt-5 text-2xl font-black text-gray-900">
                      {turno.servicio?.nombre || "Servicio"}
                    </h2>
                    <div className="mt-6 space-y-4 border-t border-gray-100 pt-5">
                      <div className="flex items-start gap-3">
                        <CalendarDays className="mt-0.5 shrink-0 text-pink-600" size={19} />
                        <div>
                          <p className="text-xs font-semibold uppercase text-gray-400">Fecha</p>
                          <p className="mt-1 font-semibold capitalize text-gray-800">
                            {inicio.toLocaleDateString("es-AR", {
                              weekday: "long",
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock3 className="mt-0.5 shrink-0 text-pink-600" size={19} />
                        <div>
                          <p className="text-xs font-semibold uppercase text-gray-400">Horario</p>
                          <p className="mt-1 font-semibold text-gray-800">
                            {inicio.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })} a {fin.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <UserRound className="mt-0.5 shrink-0 text-pink-600" size={19} />
                        <div>
                          <p className="text-xs font-semibold uppercase text-gray-400">Profesional</p>
                          <p className="mt-1 font-semibold text-gray-800">{turno.profesional?.nombre || "Sin asignar"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-7 grid grid-cols-2 gap-3">
                      <button
                        disabled={bloqueado || procesando === turno.id}
                        onClick={() => handleCancelar(turno.id)}
                        className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-3 text-sm font-bold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400"
                      >
                        <X size={17} /> Cancelar
                      </button>
                      <button
                        disabled={procesando === turno.id}
                        onClick={() => handleArchivar(turno.id)}
                        className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-bold text-gray-700 hover:border-pink-200 hover:bg-pink-50 hover:text-pink-700 disabled:opacity-40"
                      >
                        <Archive size={17} /> Archivar
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {turnosFiltrados.length > porPagina && (
              <div className="mt-10 flex flex-col items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white px-5 py-4 sm:flex-row">
                <p className="text-sm text-gray-500">
                  Mostrando {turnosPagina.length} de {turnosFiltrados.length} turnos
                </p>
                <div className="flex items-center gap-2">
                  <button disabled={paginaActual === 1} onClick={() => setPagina((actual) => Math.max(1, actual - 1))} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 disabled:opacity-40">Anterior</button>
                  <span className="px-2 text-sm font-semibold text-gray-600">{paginaActual} / {totalPaginas}</span>
                  <button disabled={paginaActual === totalPaginas} onClick={() => setPagina((actual) => Math.min(totalPaginas, actual + 1))} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 disabled:opacity-40">Siguiente</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <CalendarDays size={36} className="text-pink-400" />
            <h2 className="mt-5 text-2xl font-black text-gray-800">No hay turnos para mostrar</h2>
            <p className="mt-2 max-w-md text-gray-500">Cambiá el filtro o reservá un nuevo servicio.</p>
            <Link to={`/${slug}/dashboard`} className="mt-6 rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold text-white hover:bg-pink-700">Reservar un turno</Link>
          </div>
        )}
      </section>
    </main>
  );
}

export default MisTurnosPage;
