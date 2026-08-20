import { ArrowDown, CalendarDays, MessageCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEstetica } from "../context/EsteticaContext";

function Hero() {
  const { estetica } = useEstetica();
  const { token, user } = useAuth();
  const { slug } = useParams();
  const navigate = useNavigate();
  const whatsapp = estetica?.whatsapp?.replace(/\D/g, "");

  const reservar = () => {
    if (token) {
      navigate(
        user?.role === "admin" ? `/${slug}/admin` : `/${slug}/dashboard`,
      );
      return;
    }
    document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="inicio" className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-gray-900">
      <img
        src={
          estetica?.hero_image ||
          "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2070&auto=format&fit=crop"
        }
        alt={`Espacio de ${estetica?.nombre || "la estética"}`}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/15" />

      <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center px-5 py-20 sm:px-8">
        <div className="max-w-2xl text-white">
          <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md">
            Belleza · bienestar · cuidado
          </span>
          <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Un momento de cuidado pensado para vos
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
            Conocé nuestros tratamientos, elegí el que necesitás y reservá tu turno online de forma simple.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={reservar} className="flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-6 py-4 font-bold text-white shadow-lg hover:bg-pink-700">
              <CalendarDays size={20} />
              {token && user?.role !== "admin" ? "Reservar turno" : token ? "Ir al panel" : "Ver servicios"}
            </button>
            {whatsapp && (
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/10 px-6 py-4 font-bold text-white backdrop-blur hover:bg-white/20">
                <MessageCircle size={20} /> Consultar por WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      <a href="#servicios" aria-label="Ver servicios" className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/30 bg-black/20 p-3 text-white backdrop-blur transition hover:bg-black/40">
        <ArrowDown size={20} />
      </a>
    </section>
  );
}

export default Hero;
