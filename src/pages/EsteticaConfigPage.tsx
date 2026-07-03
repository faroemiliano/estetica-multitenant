import { useEffect, useState } from "react";
import { actualizarEstetica, obtenerEstetica } from "../services/esteticas";

import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function ConfigEsteticaPage() {
  const { slug } = useParams();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || user.role !== "admin") {
    return <Navigate to={`/${slug}`} replace />;
  }

  const [form, setForm] = useState({
    logo_url: "",
    hero_image: "",
    whatsapp: "",
    instagram_url: "",
    direccion: "",
    horarios: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const guardar = async () => {
    const payload = Object.fromEntries(
      Object.entries(form).filter(([_, value]) => value !== ""),
    );

    console.log("SLUG:", slug);
    console.log("PAYLOAD:", payload);

    if (!slug) return;

    const response = await actualizarEstetica(slug, payload);

    console.log("RESPUESTA:", response);

    alert("Guardado correctamente");
  };

  useEffect(() => {
    const load = async () => {
      if (!slug) return;

      const data = await obtenerEstetica(slug);

      setForm({
        logo_url: data.logo_url || "",
        hero_image: data.hero_image || "",
        whatsapp: data.whatsapp || "",
        instagram_url: data.instagram_url || "",
        direccion: data.direccion || "",
        horarios: data.horarios || "",
      });
    };

    load();
  }, [slug]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-100 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {/* HEADER */}
        <div className="mb-10 text-center">
          <span className="mb-4 inline-block rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg">
            Administración
          </span>

          <h1 className="text-4xl font-black text-gray-900">
            Configuración de la Estética
          </h1>

          <p className="mt-3 text-gray-500">
            Personalizá la apariencia y los datos de tu página.
          </p>
        </div>

        {/* CARD */}
        <div className="rounded-[36px]  border border-pink-100 bg-white p-8 shadow-[0_20px_60px_rgba(236,72,153,0.10)]">
          <div className="grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Logo URL
              </label>

              <input
                name="logo_url"
                placeholder="https://..."
                value={form.logo_url}
                onChange={handleChange}
                className="w-full rounded-2xl border border-pink-200 px-4 py-3 outline-none transition focus:border-pink-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Imagen principal (Hero)
              </label>

              <input
                name="hero_image"
                placeholder="https://..."
                value={form.hero_image}
                onChange={handleChange}
                className="w-full rounded-2xl border border-pink-200 px-4 py-3 outline-none transition focus:border-pink-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                WhatsApp
              </label>

              <input
                name="whatsapp"
                placeholder="5491122334455"
                value={form.whatsapp}
                onChange={handleChange}
                className="w-full rounded-2xl border border-pink-200 px-4 py-3 outline-none transition focus:border-pink-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Instagram
              </label>

              <input
                name="instagram_url"
                placeholder="https://instagram.com/..."
                value={form.instagram_url}
                onChange={handleChange}
                className="w-full rounded-2xl border border-pink-200 px-4 py-3 outline-none transition focus:border-pink-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Dirección
              </label>

              <input
                name="direccion"
                placeholder="Av. Siempre Viva 123"
                value={form.direccion}
                onChange={handleChange}
                className="w-full rounded-2xl border border-pink-200 px-4 py-3 outline-none transition focus:border-pink-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Horario
              </label>

              <textarea
                name="horarios"
                value={form.horarios}
                onChange={handleChange}
                rows={5}
                className="w-full rounded-2xl border border-pink-200 p-3"
              />
            </div>

            {/* PREVIEW HERO */}
            {form.hero_image && (
              <div className="mt-3 overflow-hidden rounded-3xl border border-pink-100">
                <img
                  src={form.hero_image}
                  alt="Preview"
                  className="h-56 w-full object-cover"
                />
              </div>
            )}

            <button
              onClick={guardar}
              className="mt-4 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-500 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(236,72,153,0.35)]"
            >
              Guardar configuración
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfigEsteticaPage;
