import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerServiciosPublicos } from "../services/servicios";
import { useAuth } from "../context/AuthContext";

type Servicio = {
  id: number;
  nombre: string;
  categoria?: string | null;
  descripcion?: string | null;
};

function Servicios() {
  const { slug } = useParams<{ slug: string }>();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!slug || slug === "admin") return;
    obtenerServiciosPublicos(slug)
      .then((data) => setServicios(Array.isArray(data) ? data : []))
      .finally(() => setCargando(false));
  }, [slug]);

  const serviciosPorCategoria = servicios.reduce<Record<string, Servicio[]>>(
    (categorias, servicio) => {
      const categoria = servicio.categoria || "Otros";
      categorias[categoria] = [...(categorias[categoria] || []), servicio];
      return categorias;
    },
    {},
  );

  const continuar = () => {
    if (!token) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate(user?.role === "admin" ? `/${slug}/admin` : `/${slug}/dashboard`);
  };

  return (
    <section id="servicios" className="scroll-mt-18 bg-[#faf8f6] px-5 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-pink-600">Nuestros servicios</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-5xl">Elegí el cuidado ideal para vos</h2>
          <p className="mt-5 leading-7 text-gray-500">Explorá las opciones disponibles y reservá online cuando estés lista.</p>
        </div>

        {cargando ? (
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[1, 2, 3].map((item) => <div key={item} className="h-64 animate-pulse rounded-3xl bg-white" />)}
          </div>
        ) : servicios.length > 0 ? (
          <>
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(serviciosPorCategoria).map(([categoria, lista]) => (
                <article key={categoria} className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-pink-600">Categoría</p>
                      <h3 className="mt-2 text-2xl font-black text-gray-900">{categoria}</h3>
                    </div>
                    <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-700">{lista.length}</span>
                  </div>
                  <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">
                    {lista.map((servicio) => (
                      <div key={servicio.id} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-700"><Check size={13} strokeWidth={3} /></span>
                        <span className="text-sm font-medium leading-5 text-gray-700">{servicio.nombre}</span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <button onClick={continuar} className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-4 font-bold text-white hover:bg-pink-700">
                {token ? "Elegir servicio y horario" : "Iniciá sesión para reservar"} <ArrowRight size={19} />
              </button>
            </div>
          </>
        ) : (
          <div className="mt-14 rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <h3 className="text-xl font-bold text-gray-800">Próximamente nuevos servicios</h3>
            <p className="mt-2 text-sm text-gray-500">Consultanos para conocer las opciones disponibles.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Servicios;
