import { Camera, Clock3, MapPin, MessageCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEstetica } from "../context/EsteticaContext";

type Horario = { inicio: string; fin: string; dia?: string };

function Footer() {
  const { estetica } = useEstetica();
  const { slug } = useParams();
  const horarios = (() => {
    try {
      const valor: unknown = estetica?.horarios;
      return Array.isArray(valor)
        ? (valor as Horario[])
        : typeof valor === "string" && valor
          ? (JSON.parse(valor) as Horario[])
          : [];
    } catch {
      return [];
    }
  })();

  const whatsapp = estetica?.whatsapp?.replace(/\D/g, "");

  return (
    <footer id="contacto" className="scroll-mt-18 bg-gray-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <Link to={`/${slug}`} className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-white">
              {estetica?.logo_url ? <img src={estetica.logo_url} alt={`Logo de ${estetica.nombre}`} className="h-full w-full object-contain p-1" /> : <span className="font-black text-pink-600">E</span>}
            </div>
            <div>
              <p className="font-black">{estetica?.nombre || "Estética"}</p>
              <p className="mt-1 text-xs text-gray-400">Belleza, bienestar y cuidado</p>
            </div>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-gray-400">Un espacio pensado para que te cuides, te relajes y disfrutes un momento para vos.</p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">Contacto</h3>
          <div className="mt-5 space-y-4 text-sm text-gray-300">
            <p className="flex items-start gap-3"><MapPin className="mt-0.5 shrink-0 text-pink-500" size={18} />{estetica?.direccion || "Consultá nuestra ubicación"}</p>
            {whatsapp && <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-white"><MessageCircle className="text-pink-500" size={18} />{estetica?.whatsapp}</a>}
            {estetica?.instagram_url && <a href={estetica.instagram_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-white"><Camera className="text-pink-500" size={18} />Instagram</a>}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">Horarios de atención</h3>
          {horarios.length > 0 ? (
            <div className="mt-5 space-y-3 text-sm text-gray-300">
              {horarios.map((horario, index) => (
                <div key={`${horario.inicio}-${index}`} className="flex items-center gap-3"><Clock3 className="shrink-0 text-pink-500" size={18} /><span>{horario.dia ? `${horario.dia}: ` : ""}{horario.inicio} a {horario.fin}</span></div>
              ))}
            </div>
          ) : <p className="mt-5 text-sm text-gray-400">Consultá los horarios disponibles al reservar.</p>}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-center text-xs text-gray-500 sm:flex-row sm:justify-between sm:px-8 sm:text-left">
          <p>© {new Date().getFullYear()} {estetica?.nombre || "Estética"}. Todos los derechos reservados.</p>
          <p>Desarrollado por Farixio</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
