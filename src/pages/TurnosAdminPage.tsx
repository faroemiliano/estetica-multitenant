import { useEffect, useState } from "react";

import { obtenerTurnosAdmin } from "../services/turnos";

function TurnosAdminPage() {
  const [turnos, setTurnos] = useState<any[]>([]);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const data = await obtenerTurnosAdmin(token);

    setTurnos(data);
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
      <div className="flex w-full max-w-7xl flex-col items-center gap-10">
        {/* HEADER */}
        <div className="flex flex-col items-center text-center">
          <span className="mb-4 rounded-full bg-black px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            Administración
          </span>

          <h1 className="max-w-3xl text-4xl font-bold text-gray-900 md:text-5xl">
            Panel de Turnos
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-500">
            Gestioná todas las reservas de tus clientes desde un solo lugar.
          </p>
        </div>

        {/* EMPTY */}
        {turnos.length === 0 ? (
          <div className="flex w-full max-w-3xl flex-col items-center justify-center rounded-[32px] border border-dashed border-gray-300 bg-white px-8 py-20 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800">
              No hay turnos registrados
            </h2>

            <p className="mt-3 max-w-md text-gray-500">
              Cuando los clientes comiencen a reservar, los turnos aparecerán
              acá.
            </p>
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {turnos.map((t: any) => (
              <div
                key={t.id}
                className="group relative overflow-hidden rounded-[32px] border border-white/60 bg-white/90 p-7 shadow-[0_10px_40px_rgba(0,0,0,0.05)] backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
              >
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 opacity-0 transition duration-500 group-hover:opacity-100" />

                <div className="relative z-10 flex h-full flex-col items-center text-center">
                  {/* FECHA */}
                  <div className="mb-5 rounded-full bg-black px-5 py-2 text-sm font-semibold tracking-wide text-white shadow-lg">
                    {t.fecha}
                  </div>

                  {/* HORA */}
                  <h2 className="text-3xl font-bold text-gray-900">{t.hora}</h2>

                  {/* CLIENTE */}
                  <div className="mt-6 flex flex-col items-center">
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
                      Cliente
                    </span>

                    <p className="mt-2 text-xl font-semibold text-gray-800">
                      {t.cliente?.nombre_completo || "Cliente"}
                    </p>
                  </div>

                  {/* SERVICIO */}
                  <div className="mt-6 flex flex-col items-center">
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
                      Servicio
                    </span>

                    <p className="mt-2 text-lg font-medium text-gray-700">
                      {t.servicio?.nombre}
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TurnosAdminPage;
