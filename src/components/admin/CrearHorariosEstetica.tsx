import { useState } from "react";
import axios from "axios";

function CrearHorariosEsteticas() {
  const [horarios, setHorarios] = useState([
    {
      inicio: "08:00",
      fin: "14:00",
    },
  ]);

  const agregarBloque = () => {
    setHorarios([
      ...horarios,
      {
        inicio: "",
        fin: "",
      },
    ]);
  };

  const actualizarHorario = (
    index: number,
    campo: "inicio" | "fin",
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
        "http://127.0.0.1:8000/estetica/horarios",
        {
          horarios,
        },
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
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">Horarios de atención</h1>

      <div className="space-y-4">
        {horarios.map((h, index) => (
          <div key={index} className="flex items-center gap-4">
            <input
              type="time"
              value={h.inicio}
              onChange={(e) =>
                actualizarHorario(index, "inicio", e.target.value)
              }
              className="rounded border p-2"
            />

            <input
              type="time"
              value={h.fin}
              onChange={(e) => actualizarHorario(index, "fin", e.target.value)}
              className="rounded border p-2"
            />

            <button
              onClick={() => eliminarHorario(index)}
              className="rounded bg-red-500 px-3 py-2 text-white"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={agregarBloque}
          className="rounded bg-pink-500 px-4 py-2 text-white"
        >
          + Agregar bloque
        </button>

        <button
          onClick={guardar}
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          Guardar horarios
        </button>
      </div>
    </div>
  );
}

export default CrearHorariosEsteticas;
