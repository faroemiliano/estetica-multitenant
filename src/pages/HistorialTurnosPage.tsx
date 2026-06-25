import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerTurnosArchivados, restaurarTurno } from "../services/turnos";

function HistorialTurnosPage() {
  const { slug } = useParams();

  const [turnos, setTurnos] = useState<any[]>([]);
  const [pagina, setPagina] = useState(1);

  const porPagina = 3;
  const indexFin = pagina * porPagina;
  const indexInicio = indexFin - porPagina;

  const historialPaginados = turnos.slice(indexInicio, indexFin);

  const totalPaginas = Math.ceil(turnos.length / porPagina);

  useEffect(() => {
    cargar();
    setPagina(1);
  }, []);

  const cargar = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const data = await obtenerTurnosArchivados(token);

    setTurnos(data);
  };

  const handleRestaurar = async (turnoId: number) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    await restaurarTurno(token, turnoId);

    cargar();
  };

  return (
    <div className="flex min-h-screen justify-center bg-[#f7f4f2] px-4 py-14">
      <div className="flex w-full max-w-6xl flex-col items-center gap-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Historial de Turnos
          </h1>

          <p className="mt-4 text-gray-500">
            Tus turnos archivados aparecen aquí.
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            to={`/${slug}/mis-turnos`}
            className="rounded-2xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Volver a Mis Turnos
          </Link>

          <Link
            to={`/${slug}`}
            className="rounded-2xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Ir al Inicio
          </Link>
        </div>

        {turnos.length === 0 ? (
          <div className="rounded-3xl bg-white p-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800">
              No hay turnos archivados
            </h2>

            <p className="mt-3 text-gray-500">
              Los turnos que ocultes aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {historialPaginados.map((t: any) => (
              <div
                key={t.id}
                className="rounded-[32px] bg-white p-7 shadow-[0_10px_40px_rgba(0,0,0,0.05)]"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-5 rounded-full bg-gray-700 px-5 py-2 text-sm font-semibold text-white">
                    {new Date(t.hora_inicio).toLocaleDateString("es-AR", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>

                  <h2 className="text-3xl font-bold text-gray-900">
                    {new Date(t.hora_inicio).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </h2>

                  <p className="mt-2 text-xl font-semibold text-gray-800">
                    {t.servicio?.nombre}
                  </p>

                  <p className="mt-2 text-gray-600">
                    Profesional: {t.profesional?.nombre}
                  </p>

                  <button
                    onClick={() => handleRestaurar(t.id)}
                    className="mt-8 w-full rounded-2xl bg-pink-500 py-3 text-sm font-semibold text-white transition hover:bg-pink-600"
                  >
                    Restaurar tarjeta
                  </button>
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

export default HistorialTurnosPage;
