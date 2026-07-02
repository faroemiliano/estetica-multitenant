import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const api = import.meta.env.VITE_API_URL;

function CrearHorariosEsteticas() {
  const [horarios, setHorarios] = useState<{ inicio: string; fin: string }[]>([
    { inicio: "08:00", fin: "14:00" },
  ]);
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    cargarHorarios();
  }, []);

  const cargarHorarios = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${api}/estetica/horarios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setHorarios(
      response.data.horarios?.length
        ? response.data.horarios
        : [{ inicio: "08:00", fin: "14:00" }],
    );
  };

  const agregarBloque = () => {
    setHorarios([...horarios, { inicio: "", fin: "" }]);
  };

  const actualizarHorario = (index: number, campo: string, valor: string) => {
    const copia = [...horarios];
    copia[index][campo] = valor;
    setHorarios(copia);
  };

  const eliminarHorario = (index) => {
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
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white px-4 py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
            Horarios de atención
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Configurá los bloques horarios de tu estética
          </p>
        </div>

        {/* CARD */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:p-8">
          <div className="space-y-4">
            {horarios.map((h, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-pink-50/40 p-4 sm:flex-row sm:items-center sm:justify-between"
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
              className="rounded-2xl border border-pink-200 bg-white px-5 py-3 text-sm font-semibold text-pink-500 shadow-sm transition hover:bg-pink-50"
            >
              + Agregar bloque
            </button>

            <button
              onClick={guardar}
              className="rounded-2xl bg-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.03] hover:bg-pink-600"
            >
              Guardar horarios
            </button>
            <button
              onClick={() => navigate(`/${slug}/admin`)}
              className="flex items-center gap-2 rounded-xl  bg-pink-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <ArrowLeft size={18} />
              Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrearHorariosEsteticas;
