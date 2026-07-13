import { useState } from "react";

import { editarServicio, eliminarServicio } from "../../services/servicios";

function ListaServicios({
  servicios,
  recargarServicios,
  profesionales = [],
}: any) {
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [formEditar, setFormEditar] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    duracion: "",
    precio: "",
    profesionalId: "",
    requiereWhatsapp: false,
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
      categoria: servicio.categoria,
      duracion: servicio.duracion,
      precio: servicio.precio,
      profesionalId: servicio.profesional_id
        ? String(servicio.profesional_id)
        : "",
      requiereWhatsapp: servicio.requiere_whatsapp,
    });
  };

  const guardarEdicion = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    if (!formEditar.profesionalId) {
      alert("Seleccioná un profesional");
      return;
    }

    await editarServicio(token, editandoId!, {
      ...formEditar,
      duracion: Number(formEditar.duracion),
      precio: Number(formEditar.precio),
      profesional_id: Number(formEditar.profesionalId),
      requiere_whatsapp: formEditar.requiereWhatsapp,
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
                <select
                  value={formEditar.categoria}
                  onChange={(e) =>
                    setFormEditar({
                      ...formEditar,
                      categoria: e.target.value,
                    })
                  }
                  className="rounded-xl border border-gray-200 px-4 py-3"
                >
                  <option value="Uñas">Uñas</option>
                  <option value="Pies">Pies</option>
                  <option value="Cejas y Pestañas">Cejas y Pestañas</option>
                  <option value="Depilación Láser">Depilación Láser</option>
                  <option value="Reflexología">Reflexología</option>
                  <option value="Masajes">Masajes</option>
                  <option value="Sesiones Faciales">Sesiones Faciales</option>
                  <option value="Micropigmentación">Micropigmentación</option>
                </select>

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

                <select
                  value={formEditar.profesionalId}
                  onChange={(e) =>
                    setFormEditar({
                      ...formEditar,
                      profesionalId: e.target.value,
                    })
                  }
                  className="rounded-xl border border-gray-200 px-4 py-3"
                >
                  <option value="">Seleccionar profesional</option>

                  {profesionales.map((profesional: any) => (
                    <option key={profesional.id} value={String(profesional.id)}>
                      {profesional.nombre}
                    </option>
                  ))}
                </select>

                <div className="md:col-span-2 rounded-xl border border-pink-200 bg-pink-50 p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formEditar.requiereWhatsapp}
                      onChange={(e) =>
                        setFormEditar({
                          ...formEditar,
                          requiereWhatsapp: e.target.checked,
                        })
                      }
                      className="h-5 w-5 accent-pink-500"
                    />

                    <div>
                      <p className="font-semibold text-gray-800">
                        Reserva únicamente por WhatsApp
                      </p>

                      <p className="text-sm text-gray-500">
                        El cliente será redirigido a WhatsApp en lugar de poder
                        reservar desde el calendario.
                      </p>
                    </div>
                  </label>
                </div>

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

                  <p className="mt-1 text-sm font-semibold text-fuchsia-600">
                    {servicio.categoria}
                  </p>

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
