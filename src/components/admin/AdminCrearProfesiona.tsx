import { useEffect, useState } from "react";
import axios from "axios";

function AdminCrearProfesional() {
  const api = import.meta.env.VITE_API_URL;

  const [nombre, setNombre] = useState("");

  const [profesionales, setProfesionales] = useState([]);

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

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-8 text-3xl font-bold">Profesionales</h1>

      <div className="mb-8 flex gap-3">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          className="flex-1 rounded-xl border p-3"
        />

        <button
          onClick={crearProfesional}
          className="rounded-xl bg-pink-500 px-6 py-3 text-white"
        >
          Crear
        </button>
      </div>

      <div className="space-y-3">
        {profesionales.map((profesional: any) => (
          <div
            key={profesional.id}
            className="flex items-center justify-between rounded-xl border p-4"
          >
            <span>{profesional.nombre}</span>

            <div className="flex gap-2">
              <button>Editar</button>

              <button>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminCrearProfesional;
