import { useState } from "react";

import { editarServicio, eliminarServicio } from "../../services/servicios";

function ListaServicios({ servicios, recargarServicios }: any) {
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [formEditar, setFormEditar] = useState({
    nombre: "",
    descripcion: "",
    duracion: "",
    precio: "",
  });

  const handleEliminar = async (id: number) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    await eliminarServicio(token, id);

    await recargarServicios();
  };

  const iniciarEdicion = (servicio: any) => {
    setEditandoId(servicio.id);

    setFormEditar({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      duracion: servicio.duracion,
      precio: servicio.precio,
    });
  };

  const guardarEdicion = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    await editarServicio(token, editandoId!, {
      ...formEditar,
      duracion: Number(formEditar.duracion),
      precio: Number(formEditar.precio),
    });

    setEditandoId(null);

    await recargarServicios();
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Servicios actuales</h2>

        <p className="text-sm text-gray-500">Administrá todos los servicios</p>
      </div>

      <div className="grid gap-4">
        {servicios.map((servicio: any) => (
          <div
            key={servicio.id}
            className="rounded-2xl border border-gray-200 p-5 transition hover:border-pink-300"
          >
            {editandoId === servicio.id ? (
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
                  value={formEditar.nombre}
                  onChange={(e) =>
                    setFormEditar({
                      ...formEditar,
                      nombre: e.target.value,
                    })
                  }
                />

                <input
                  className="rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
                  value={formEditar.descripcion}
                  onChange={(e) =>
                    setFormEditar({
                      ...formEditar,
                      descripcion: e.target.value,
                    })
                  }
                />

                <input
                  className="rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
                  value={formEditar.duracion}
                  onChange={(e) =>
                    setFormEditar({
                      ...formEditar,
                      duracion: e.target.value,
                    })
                  }
                />

                <input
                  className="rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
                  value={formEditar.precio}
                  onChange={(e) =>
                    setFormEditar({
                      ...formEditar,
                      precio: e.target.value,
                    })
                  }
                />

                <div className="flex gap-3">
                  <button
                    onClick={guardarEdicion}
                    className="rounded-xl bg-pink-500 px-5 py-2 font-medium text-white transition hover:bg-pink-600"
                  >
                    Guardar
                  </button>

                  <button
                    onClick={() => setEditandoId(null)}
                    className="rounded-xl border border-gray-300 px-5 py-2 font-medium transition hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {servicio.nombre}
                  </h3>

                  <p className="mt-1 text-gray-500">{servicio.descripcion}</p>

                  <p className="mt-2 text-sm font-medium text-pink-600">
                    Profesional: {servicio.profesional?.nombre}
                  </p>

                  <div className="mt-3 flex gap-4 text-sm text-gray-600">
                    <span>⏱ {servicio.duracion} min</span>

                    <span className="font-semibold text-pink-600">
                      ${servicio.precio}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => iniciarEdicion(servicio)}
                    className="rounded-xl border border-gray-300 px-5 py-2 font-medium transition hover:bg-gray-100"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleEliminar(servicio.id)}
                    className="rounded-xl bg-red-500 px-5 py-2 font-medium text-white transition hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListaServicios;
