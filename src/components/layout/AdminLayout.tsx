import type { ReactNode } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  Eye,
  LayoutDashboard,
  Scissors,
  Settings,
  UserRound,
  Users,
} from "lucide-react";
import { useEstetica } from "../../context/EsteticaContext";

type Props = {
  children: ReactNode;
};

function AdminLayout({ children }: Props) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { estetica } = useEstetica();

  const opciones = [
    { nombre: "Resumen", icono: LayoutDashboard, ruta: `/${slug}/admin`, exacta: true },
    { nombre: "Turnos", icono: CalendarDays, ruta: `/${slug}/admin/turnos` },
    { nombre: "Clientes", icono: Users, ruta: `/${slug}/admin/clientes` },
    { nombre: "Servicios", icono: Scissors, ruta: `/${slug}/admin/servicios` },
    { nombre: "Profesionales", icono: UserRound, ruta: `/${slug}/admin/profesionales` },
    { nombre: "Horarios", icono: Clock3, ruta: `/${slug}/admin/horarios` },
    { nombre: "Configuración", icono: Settings, ruta: `/${slug}/admin/config` },
  ];

  return (
    <div className="min-h-screen w-full bg-stone-50">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
        <aside className="h-fit rounded-3xl bg-gray-950 p-5 text-white shadow-xl lg:sticky lg:top-6 lg:w-64 lg:shrink-0">
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-pink-600 text-lg font-black">
              {estetica?.logo_url ? (
                <img src={estetica.logo_url} alt="Logo" className="h-full w-full bg-white object-contain p-1" />
              ) : (
                estetica?.nombre?.charAt(0) || "A"
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-black">{estetica?.nombre || "Aura Estética"}</p>
              <p className="text-xs text-gray-400">Administración</p>
            </div>
          </div>

          <nav className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {opciones.map(({ nombre, icono: Icono, ruta, exacta }) => {
              const activa = exacta
                ? location.pathname === ruta || location.pathname === `${ruta}/`
                : location.pathname.startsWith(ruta);
              return (
                <button
                  key={nombre}
                  onClick={() => navigate(ruta)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold ${
                    activa
                      ? "bg-pink-600 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icono size={18} /> {nombre}
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => navigate(`/${slug}`)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-gray-200 hover:bg-white/10"
          >
            <Eye size={17} /> Ver página pública
          </button>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </main>
    </div>
  );
}

export default AdminLayout;
