import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerServiciosPublicos } from "../services/servicios";

function Servicios() {
  const { slug } = useParams<{ slug: string }>();

  const [servicios, setServicios] = useState<any[]>([]);

  useEffect(() => {
    if (!slug || slug === "admin") return;
    cargarServicios();
  }, [slug]);

  const cargarServicios = async () => {
    const data = await obtenerServiciosPublicos(slug as string);
    setServicios(Array.isArray(data) ? data : []);
  };

  // 🔥 AGRUPACIÓN POR CATEGORÍA (lo que querías)
  const serviciosPorCategoria = servicios.reduce((acc: any, servicio: any) => {
    const categoria = servicio.categoria || "Otros";

    if (!acc[categoria]) {
      acc[categoria] = [];
    }

    acc[categoria].push(servicio);

    return acc;
  }, {});

  return (
    <section className="flex w-full justify-center bg-[#faf7f5] py-32">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6">
        {/* HEADER */}
        {/* <div className="flex flex-col items-center text-center">
          <h2 className="max-w-2xl text-4xl font-bold text-gray-900 md:text-5xl">
            Elegí el tratamiento perfecto para vos
          </h2>

          <p className="mt-5 max-w-xl text-gray-500 md:text-lg">
            Experiencias pensadas para tu bienestar, belleza y cuidado personal.
          </p>
        </div> */}

        {/* GRID POR CATEGORÍA */}
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          {Object.entries(serviciosPorCategoria).map(
            ([categoria, lista]: any) => {
              return (
                <div
                  key={categoria}
                  className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* CATEGORÍA (UNA SOLA VEZ) */}
                  <h3 className="text-3xl font-bold text-gray-900">
                    {categoria}
                  </h3>

                  <div className="mt-3 h-1 w-20 rounded-full bg-pink-500" />

                  {/* SERVICIOS */}
                  <div className="mt-8 flex flex-col gap-3">
                    {lista.map((servicio: any) => (
                      <div
                        key={servicio.id}
                        className="flex items-center gap-3"
                      >
                        <span className="text-pink-500">✓</span>
                        <span className="text-gray-700">{servicio.nombre}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            },
          )}
        </div>

        {/* EMPTY STATE */}
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
