import { useEffect, useState } from "react";
import axios from "axios";
import { Clock3 } from "lucide-react";
import AdminLayout from "../layout/AdminLayout";
import AdminSectionHeader from "./AdminSectionHeader";

const api = import.meta.env.VITE_API_URL;

type Horario = {
  inicio: string;
  fin: string;
};

function CrearHorariosEsteticas() {
  const [horarios, setHorarios] = useState<Horario[]>([
    { inicio: "08:00", fin: "14:00" },
  ]);
  useEffect(() => {
    const cargarHorarios = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${api}/estetica/horarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHorarios(
        response.data.horarios?.length
          ? response.data.horarios
          : [{ inicio: "08:00", fin: "14:00" }],
      );
    };
    void cargarHorarios();
  }, []);

  const agregarBloque = () => {
    setHorarios([...horarios, { inicio: "", fin: "" }]);
  };

  const actualizarHorario = (
    index: number,
    campo: keyof Horario,
    valor: string,
  ) => {
    const copia = [...horarios];
    copia[index][campo] = valor;
    setHorarios(copia);
  };

  const eliminarHorario = (index: number) => {
    setHorarios(horarios.filter((_, i) => i !== index));
  };

  const guardar = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `${api}/estetica/horarios`,
        { horarios },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Horarios guardados");
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <AdminSectionHeader eyebrow="Disponibilidad" title="Horarios de atención" description="Configurá los bloques generales en los que la estética recibe turnos." icon={<Clock3 size={17} />} />

        {/* CARD */}
        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm md:p-8">
          <div className="space-y-4">
            {horarios.map((h, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* INPUTS */}
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500">
                      Inicio
                    </span>

                    <input
                      type="time"
                      value={h.inicio}
                      onChange={(e) =>
                        actualizarHorario(index, "inicio", e.target.value)
                      }
                      className="rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-200"
                    />
                  </div>

                  <span className="mt-5 text-sm font-semibold text-pink-400">
                    →
                  </span>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500">
                      Fin
                    </span>

                    <input
                      type="time"
                      value={h.fin}
                      onChange={(e) =>
                        actualizarHorario(index, "fin", e.target.value)
                      }
                      className="rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-200"
                    />
                  </div>
                </div>

                {/* DELETE */}
                <button
                  onClick={() => eliminarHorario(index)}
                  className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.03] hover:bg-red-600 sm:self-auto"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              onClick={agregarBloque}
              className="rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 shadow-sm transition hover:border-pink-200 hover:bg-pink-50"
            >
              + Agregar bloque
            </button>

            <button
              onClick={guardar}
              className="rounded-xl bg-pink-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-pink-700"
            >
              Guardar horarios
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default CrearHorariosEsteticas;
