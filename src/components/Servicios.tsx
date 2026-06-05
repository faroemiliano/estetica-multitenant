import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { obtenerServiciosPublicos } from "../services/servicios";

function Servicios() {
  const { slug } = useParams<{ slug: string }>();

  const [servicios, setServicios] = useState<any[]>([]);
  const [profesionalAbierto, setProfesionalAbierto] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (slug) {
      cargarServicios();
    }
  }, [slug]);

  const cargarServicios = async () => {
    try {
      const data = await obtenerServiciosPublicos(slug as string);

      setServicios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error cargando servicios:", error);
    }
  };

  const serviciosAgrupados = servicios.reduce((acc: any, servicio: any) => {
    const id = servicio.profesional?.id;
    const nombre = servicio.profesional?.nombre;

    if (!acc[id]) {
      acc[id] = {
        nombre,
        servicios: [],
      };
    }

    acc[id].servicios.push(servicio);

    return acc;
  }, {});

  return (
    <section className="flex w-full justify-center bg-[#faf7f5] py-32">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6">
        {/* HEADER */}
        <div className="flex flex-col items-center text-center">
          <h2 className="max-w-2xl text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
            Elegí el tratamiento perfecto para vos
          </h2>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-500 md:text-lg">
            Experiencias pensadas para tu bienestar, belleza y cuidado personal.
          </p>
        </div>

        {/* GRID */}
        <div className="grid w-full grid-cols-1 content-start gap-6 md:grid-cols-3">
          {Object.entries(serviciosAgrupados).map(
            ([profesionalId, data]: any) => {
              const estaAbierto = profesionalAbierto === Number(profesionalId);

              const serviciosMostrar = estaAbierto
                ? data.servicios
                : data.servicios.slice(0, 4);

              return (
                <div
                  key={profesionalId}
                  onClick={() =>
                    setProfesionalAbierto(
                      estaAbierto ? null : Number(profesionalId),
                    )
                  }
                  className="
    self-start
    cursor-pointer
    rounded-3xl
    bg-white
    p-8
    shadow-sm
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-lg
  "
                >
                  <h3 className="text-3xl font-bold text-gray-900">
                    {data.nombre}
                  </h3>

                  <div className="mt-3 h-1 w-20 rounded-full bg-pink-500" />

                  <div className="mt-8 flex flex-col gap-3">
                    {serviciosMostrar.map((servicio: any) => (
                      <div
                        key={servicio.id}
                        className="flex items-center gap-3"
                      >
                        <span className="text-pink-500">✓</span>

                        <span className="text-gray-700">{servicio.nombre}</span>
                      </div>
                    ))}
                  </div>

                  {data.servicios.length > 4 && (
                    <div className="mt-6 text-center text-sm font-medium text-pink-600">
                      {estaAbierto
                        ? "Ver menos"
                        : `+ ${data.servicios.length - 4} servicios más`}
                    </div>
                  )}
                </div>
              );
            },
          )}
        </div>

        {/* EMPTY */}
        {servicios.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <h3 className="text-2xl font-semibold text-gray-700">
              No hay servicios disponibles
            </h3>

            <p className="mt-3 text-gray-500">
              Esta estética todavía no cargó servicios.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Servicios;
