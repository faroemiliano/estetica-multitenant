import { useState, useEffect } from "react";

import axios from "axios";

function CrearServicioForm({ recargarServicios }: any) {
  const api = import.meta.env.VITE_API_URL;
  const [profesionales, setProfesionales] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    duracion: "",
    precio: "",
    profesional_id: "",
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
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    obtenerProfesionales();
  }, []);

  const obtenerProfesionales = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${api}/profesionales`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfesionales(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="overflow-hidden rounded-[32px] border border-white/60 bg-white/90 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur">
      {/* HEADER */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-7 text-white">
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

            {profesionales.map((p: any) => (
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
            <option value="Perfilados">Perfilados</option>
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

        {/* BUTTON */}
        <button
          onClick={crearServicio}
          className="mt-2 w-full rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
        >
          Crear servicio
        </button>
      </div>
    </div>
  );
}

export default CrearServicioForm;
