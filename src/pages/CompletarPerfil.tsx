import { useState } from "react";

import { completarPerfil } from "../services/clientes";

import { useAuth } from "../context/AuthContext";

import { useNavigate, useParams } from "react-router-dom";

function CompletarPerfilPage() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const { token } = useAuth();

  const [form, setForm] = useState({
    nombre_completo: "",
    fecha_nacimiento: "",
    telefono: "",
  });

  const guardarPerfil = async () => {
    if (!/^\+\d{7,15}$/.test(form.telefono.replace(/\s/g, ""))) {
      alert(
        "Ingresá un teléfono válido con código de país. Ej: +5491123456789",
      );
      return;
    }

    try {
      await completarPerfil(token, form);

      const user = JSON.parse(localStorage.getItem("user") || "null");

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          perfil_completo: true,
        }),
      );

      navigate(`/${slug}/dashboard`);
    } catch (error: any) {
      console.log(JSON.stringify(error.response.data, null, 2));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f4f2] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Completar perfil</h1>

          <p className="mt-2 text-sm text-gray-500">
            Necesitamos algunos datos antes de reservar
          </p>
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-5">
          {/* NOMBRE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nombre completo
            </label>

            <input
              type="text"
              placeholder="Tu nombre"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
              onChange={(e) =>
                setForm({
                  ...form,
                  nombre_completo: e.target.value,
                })
              }
            />
          </div>

          {/* FECHA */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Fecha de nacimiento
            </label>

            <input
              type="date"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
              onChange={(e) =>
                setForm({
                  ...form,
                  fecha_nacimiento: e.target.value,
                })
              }
            />
          </div>

          {/* TELEFONO */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Teléfono
            </label>

            <input
              type="tel"
              placeholder="+54 11 12345678"
              value={form.telefono}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
              onChange={(e) => {
                let value = e.target.value;

                // Mantiene solo + y números
                value = value.replace(/[^\d+]/g, "");

                // Solo permite un +
                if (value.includes("+")) {
                  value = "+" + value.replace(/\+/g, "").replace(/[^\d]/g, "");
                }

                setForm({
                  ...form,
                  telefono: value,
                });
              }}
            />

            <p className="mt-1 text-xs text-gray-500">
              Ingresá el código de país. Ej: +54 11..., +34..., +1...
            </p>
          </div>

          {/* BUTTON */}
          <button
            onClick={guardarPerfil}
            className="mt-2 rounded-2xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Guardar perfil
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompletarPerfilPage;
