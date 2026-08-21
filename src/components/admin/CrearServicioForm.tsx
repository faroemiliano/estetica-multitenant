import { useState, useEffect } from "react";

import axios from "axios";

type Profesional = { id: number; nombre: string };
type Props = { recargarServicios: () => void | Promise<void> };

function CrearServicioForm({ recargarServicios }: Props) {
  const api = import.meta.env.VITE_API_URL;
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    duracion: "",
    precio: "",
    profesional_id: "",
    requiere_whatsapp: false,
  });

  const crearServicio = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${api}/servicios`,
        {
          ...form,
          duracion: Number(form.duracion),
          precio: Number(form.precio),
          profesional_id: Number(form.profesional_id),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await recargarServicios();

      alert("Servicio creado");

      setForm({
        nombre: "",
        descripcion: "",
        categoria: "",
        duracion: "",
        precio: "",
        profesional_id: "",
        requiere_whatsapp: false,
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const obtenerProfesionales = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${api}/profesionales`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfesionales(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    void obtenerProfesionales();
  }, [api]);
  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
      {/* HEADER */}
      <div className="border-b border-white/10 bg-pink-900 px-8 py-7 text-white">
        <h2 className="text-3xl font-bold">Crear servicio</h2>

        <p className="mt-2 text-sm text-white/80">
          Agregá nuevos servicios para tu estética
        </p>
      </div>

      {/* FORM */}
      <div className="flex flex-col gap-8 p-8">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Profesional
          </label>

          <select
            value={form.profesional_id}
            onChange={(e) =>
              setForm({
                ...form,
                profesional_id: e.target.value,
              })
            }
            className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none transition-all duration-300 focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-100"
          >
            <option value="">Seleccionar profesional</option>

            {profesionales.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Categoría
          </label>

          <select
            value={form.categoria}
            onChange={(e) =>
              setForm({
                ...form,
                categoria: e.target.value,
              })
            }
            className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none transition-all duration-300 focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-100"
          >
            <option value="">Seleccionar categoría</option>

            <option value="Uñas">Manos</option>
            <option value="Pies">Pies</option>
            <option value="Cejas y Pestañas">Cejas y Pestañas</option>
            <option value="Depilación Láser">Depilación Láser</option>
            <option value="Reflexología">Reflexología</option>
            <option value="Masajes">Masajes</option>
            <option value="Sesiones Faciales">Sesiones Faciales</option>
            <option value="Micropigmentación">Micropigmentación</option>
          </select>
        </div>
        {/* NOMBRE */}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Nombre del servicio
          </label>

          <input
            className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none transition-all duration-300 focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-100"
            placeholder="Ej: Limpieza facial premium"
            value={form.nombre}
            onChange={(e) =>
              setForm({
                ...form,
                nombre: e.target.value,
              })
            }
          />
        </div>

        {/* DESCRIPCION */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Descripción
          </label>

          <textarea
            rows={4}
            className="resize-none rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none transition-all duration-300 focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-100"
            placeholder="Describí el servicio..."
            value={form.descripcion}
            onChange={(e) =>
              setForm({
                ...form,
                descripcion: e.target.value,
              })
            }
          />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* DURACION */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Duración
            </label>

            <input
              className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none transition-all duration-300 focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-100"
              placeholder="60 min"
              value={form.duracion}
              onChange={(e) =>
                setForm({
                  ...form,
                  duracion: e.target.value,
                })
              }
            />
          </div>

          {/* PRECIO */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Precio
            </label>

            <input
              className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none transition-all duration-300 focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-100"
              placeholder="$15000"
              value={form.precio}
              onChange={(e) =>
                setForm({
                  ...form,
                  precio: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="rounded-2xl border border-pink-100 bg-pink-50 p-5">
          <label className="flex cursor-pointer items-center gap-4">
            <input
              type="checkbox"
              checked={form.requiere_whatsapp}
              onChange={(e) =>
                setForm({
                  ...form,
                  requiere_whatsapp: e.target.checked,
                })
              }
              className="h-5 w-5 accent-pink-500"
            />

            <div>
              <p className="font-semibold text-gray-800">
                Reserva únicamente por WhatsApp
              </p>

              <p className="text-sm text-gray-500">
                El cliente verá un botón para comunicarse por WhatsApp en lugar
                del calendario de reservas.
              </p>
            </div>
          </label>
        </div>

        {/* BUTTON */}
        <button
          onClick={crearServicio}
          className="mt-2 w-full rounded-xl bg-pink-600 py-4 text-sm font-bold text-white shadow-sm hover:bg-pink-700"
        >
          Crear servicio
        </button>
      </div>
    </div>
  );
}

export default CrearServicioForm;
