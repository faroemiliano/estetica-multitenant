import { CalendarDays, LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import GoogleLoginButton from "./GoogleLoginButton";
import { useEstetica } from "../context/EsteticaContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { estetica } = useEstetica();
  const { slug } = useParams();
  const { token, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const irA = (destino: string) => {
    navigate(destino);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    irA(`/${slug}`);
  };

  const linksSesion = token ? (
    user?.role === "admin" ? (
      <button
        onClick={() => irA(`/${slug}/admin`)}
        className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-gray-700"
      >
        Panel administrador
      </button>
    ) : user?.perfil_completo === false ? (
      <button
        onClick={() => irA(`/${slug}/completar-perfil`)}
        className="flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-pink-700"
      >
        Completar registro
      </button>
    ) : (
      <>
        <button
          onClick={() => irA(`/${slug}/dashboard`)}
          className="flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-pink-700"
        >
          <CalendarDays size={17} /> Reservar turno
        </button>
        <button
          onClick={() => irA(`/${slug}/mis-turnos`)}
          className="rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
        >
          Mis turnos
        </button>
      </>
    )
  ) : null;

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to={`/${slug}`} className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-pink-50">
            {estetica?.logo_url ? (
              <img
                src={estetica.logo_url}
                alt={`Logo de ${estetica.nombre}`}
                className="h-full w-full object-contain p-1"
              />
            ) : (
              <span className="text-xl font-black text-pink-600">
                {estetica?.nombre?.charAt(0) || "E"}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-black text-gray-900">
              {estetica?.nombre || "Estética"}
            </p>
            <p className="hidden text-xs text-gray-500 sm:block">
              Belleza y bienestar
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <a href="#inicio" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">Inicio</a>
          <a href="#servicios" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">Servicios</a>
          <a href="#contacto" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">Contacto</a>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {linksSesion}
          {!token && <GoogleLoginButton />}
          {token && (
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="rounded-xl p-2.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={19} />
            </button>
          )}
        </div>

        <button
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((abierto) => !abierto)}
          className="rounded-xl p-2 text-gray-700 hover:bg-gray-100 md:hidden"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <a href="#inicio" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold hover:bg-gray-50">Inicio</a>
            <a href="#servicios" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold hover:bg-gray-50">Servicios</a>
            <a href="#contacto" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold hover:bg-gray-50">Contacto</a>
            <div className="my-2 border-t border-gray-100" />
            {linksSesion}
            {!token && <GoogleLoginButton />}
            {token && (
              <button onClick={handleLogout} className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                <LogOut size={17} /> Cerrar sesión
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
