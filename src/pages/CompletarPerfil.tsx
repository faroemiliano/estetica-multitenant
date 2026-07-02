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
      if (!token) return;
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
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white flex items-center justify-center px-6 py-10">
      {" "}
      <div className="w-full max-w-lg rounded-[32px] bg-white/90 backdrop-blur-md border border-rose-100 shadow-2xl p-10">
        {" "}
        {/* HEADER */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-4xl">
            🌸
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-rose-900">
            Completar perfil
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-rose-500">
            Solo necesitamos algunos datos para brindarte una experiencia
            personalizada.
          </p>
        </div>
        {/* FORM */}
        <div className="flex flex-col gap-5">
          {/* NOMBRE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-rose-700">
              Nombre completo
            </label>

            <input
              type="text"
              placeholder="Tu nombre"
              className="
w-full
rounded-2xl
border
border-rose-200
bg-rose-50/40
px-5
py-3.5
text-gray-700
placeholder:text-rose-300
transition
duration-200
outline-none
focus:border-pink-400
focus:bg-white
focus:ring-4
focus:ring-pink-100
"
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
            <label className="mb-2 block text-sm font-medium text-rose-700">
              Fecha de nacimiento
            </label>

            <input
              type="date"
              className="
w-full
rounded-2xl
border
border-rose-200
bg-rose-50/40
px-5
py-3.5
text-gray-700
placeholder:text-rose-300
transition
duration-200
outline-none
focus:border-pink-400
focus:bg-white
focus:ring-4
focus:ring-pink-100
"
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
            <label className="mb-2 block text-sm font-medium text-rose-700">
              Teléfono
            </label>

            <input
              type="tel"
              placeholder="+54 11 12345678"
              value={form.telefono}
              className="
w-full
rounded-2xl
border
border-rose-200
bg-rose-50/40
px-5
py-3.5
text-gray-700
placeholder:text-rose-300
transition
duration-200
outline-none
focus:border-pink-400
focus:bg-white
focus:ring-4
focus:ring-pink-100
"
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

            <p className="mt-2 text-xs text-rose-400">
              Ingresá el código de país. Ej: +54 11..., +34..., +1...
            </p>
          </div>

          {/* BUTTON */}
          <button
            onClick={guardarPerfil}
            className="
    mt-4
    w-full
    rounded-2xl
    bg-gradient-to-r
    from-pink-500
    to-rose-500
    py-3.5
    font-semibold
    text-white
    shadow-lg
    transition-all
    duration-300
    hover:scale-[1.02]
    hover:shadow-xl
    active:scale-[0.98]
  "
          >
            Guardar perfil
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompletarPerfilPage;
