import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function AdminCrearProfesional() {
  const api = import.meta.env.VITE_API_URL;

  const [nombre, setNombre] = useState("");

  const [nombreEditado, setNombreEditado] = useState("");

  const [profesionales, setProfesionales] = useState([]);

  const [profesionalEditando, setProfesionalEditando] = useState<number | null>(
    null,
  );

  const [disponibilidad, setDisponibilidad] = useState<any[]>([]);

  const navigate = useNavigate();

  const { slug } = useParams();

  const DIAS = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const cargarDisponibilidad = async (profesionalId: number) => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${api}/profesionales/${profesionalId}/disponibilidad`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setDisponibilidad(response.data);
  };

  const cargarProfesionales = async () => {
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

  useEffect(() => {
    cargarProfesionales();
  }, []);

  const crearProfesional = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${api}/profesionales`,
        {
          nombre,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setNombre("");

      await cargarProfesionales();

      alert("Profesional creada");
    } catch (error) {
      console.log(error);
    }
  };

  const guardarNombre = async (profesionalId: number) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${api}/profesionales/${profesionalId}`,
        {
          nombre: nombreEditado,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await cargarProfesionales();

      alert("Nombre actualizado");
    } catch (error) {
      console.log(error);
    }
  };

  const guardarDisponibilidad = async (profesionalId: number) => {
    const token = localStorage.getItem("token");

    await axios.put(
      `${api}/profesionales/${profesionalId}/disponibilidad`,
      disponibilidad,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    alert("Disponibilidad guardada");
  };

  const eliminarProfesional = async (profesionalId: number) => {
    try {
      const confirmar = window.confirm(
        "¿Seguro que querés eliminar este profesional?",
      );

      if (!confirmar) return;

      const token = localStorage.getItem("token");

      await axios.delete(`${api}/profesionales/${profesionalId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await cargarProfesionales();

      alert("Profesional eliminado");
    } catch (error) {
      console.log(error);
      alert("No se pudo eliminar");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-100 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate(`/${slug}`)}
          className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-pink-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-pink-50"
        >
          🏠 Ver Página Pública
        </button>
        <div className="mb-10 text-center">
          <span className="mb-4 inline-block rounded-full bg-pink-100 px-5 py-2 text-xs font-bold uppercase tracking-widest text-pink-700">
            Equipo
          </span>

          <h1 className="text-4xl font-black text-gray-900">
            Gestión de profesionales
          </h1>

          <p className="mt-3 text-gray-500">
            Administrá horarios y disponibilidad del equipo.
          </p>
        </div>

        <div className="mb-10 rounded-[32px] border border-pink-100 bg-white p-6 shadow-lg">
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre"
              className="flex-1 rounded-2xl border border-pink-200 p-4 focus:border-pink-400 focus:outline-none"
            />

            <button
              onClick={crearProfesional}
              className="rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-500 px-8 py-4 font-bold text-white shadow-lg"
            >
              Crear
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {profesionales.map((profesional: any) => (
            <div
              key={profesional.id}
              className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-sm transition hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                {profesionalEditando === profesional.id ? (
                  <input
                    value={nombreEditado}
                    onChange={(e) => setNombreEditado(e.target.value)}
                    className="rounded-lg border px-3 py-2"
                  />
                ) : (
                  <div>
                    <h3 className="text-xl font-black text-gray-900">
                      {profesional.nombre}
                    </h3>

                    <p className="text-sm text-gray-500">Profesional activo</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    className="rounded-xl border border-pink-200 px-4 py-2 font-semibold text-pink-600 hover:bg-pink-50"
                    onClick={async () => {
                      if (profesionalEditando === profesional.id) {
                        setProfesionalEditando(null);
                        return;
                      }

                      setProfesionalEditando(profesional.id);

                      setNombreEditado(profesional.nombre);

                      await cargarDisponibilidad(profesional.id);
                    }}
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => eliminarProfesional(profesional.id)}
                    className="rounded-xl bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {profesionalEditando === profesional.id && (
                <div className="mt-6 rounded-[28px] border border-pink-100 bg-pink-50/40 p-6">
                  <div className="mb-6">
                    <label className="mb-2 block font-medium">
                      Nombre del profesional
                    </label>

                    <div className="flex gap-2">
                      <input
                        value={nombreEditado}
                        onChange={(e) => setNombreEditado(e.target.value)}
                        className="flex-1 rounded-lg border p-2"
                      />

                      <button
                        onClick={() => guardarNombre(profesional.id)}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-white"
                      >
                        Guardar nombre
                      </button>
                    </div>
                  </div>
                  {DIAS.map((dia, index) => {
                    const actual = disponibilidad.find(
                      (d) => d.dia_semana === index,
                    );

                    return (
                      <div
                        key={index}
                        className="mb-3 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
                      >
                        <span className="w-32 font-semibold text-gray-700">
                          {dia}
                        </span>

                        <input
                          type="checkbox"
                          className="h-5 w-5 accent-pink-500"
                          checked={!!actual}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setDisponibilidad([
                                ...disponibilidad,
                                {
                                  dia_semana: index,
                                  hora_inicio: "09:00",
                                  hora_fin: "18:00",
                                  activo: true,
                                },
                              ]);
                            } else {
                              setDisponibilidad(
                                disponibilidad.filter(
                                  (d) => d.dia_semana !== index,
                                ),
                              );
                            }
                          }}
                        />

                        {actual && (
                          <>
                            <input
                              type="time"
                              className="rounded-xl border border-pink-200 px-3 py-2"
                              value={actual.hora_inicio}
                              onChange={(e) => {
                                setDisponibilidad(
                                  disponibilidad.map((d) =>
                                    d.dia_semana === index
                                      ? {
                                          ...d,
                                          hora_inicio: e.target.value,
                                        }
                                      : d,
                                  ),
                                );
                              }}
                            />

                            <input
                              type="time"
                              className="rounded-xl border border-pink-200 px-3 py-2"
                              value={actual.hora_fin}
                              onChange={(e) => {
                                setDisponibilidad(
                                  disponibilidad.map((d) =>
                                    d.dia_semana === index
                                      ? {
                                          ...d,
                                          hora_fin: e.target.value,
                                        }
                                      : d,
                                  ),
                                );
                              }}
                            />
                          </>
                        )}
                      </div>
                    );
                  })}

                  <button
                    onClick={() => guardarDisponibilidad(profesional.id)}
                    className="mt-6 w-full rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-500 py-4 font-bold text-white shadow-lg"
                  >
                    Guardar disponibilidad
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminCrearProfesional;
