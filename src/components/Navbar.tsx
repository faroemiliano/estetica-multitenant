import { useNavigate, Link } from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton";
import { useParams } from "react-router-dom";
import { useEstetica } from "../context/EsteticaContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { estetica } = useEstetica();
  const { slug } = useParams();
  const { token, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(`/${slug}`);
    setMenuOpen(false);
  };

  const logoUrl = estetica?.logo_url;
  const nombre = estetica?.nombre;

  const NavLinks = () => (
    <>
      {token && user?.role === "admin" ? (
        <button
          onClick={() => {
            navigate(`/${slug}/admin`);
            setMenuOpen(false);
          }}
          className="rounded-2xl border border-gray-200 bg-white px-6 py-2.5 text-md font-semibold"
        >
          Panel Admin
        </button>
      ) : (
        token && (
          <>
            <button
              onClick={() => {
                navigate(`/${slug}/dashboard`);
                setMenuOpen(false);
              }}
              className="rounded-2xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold"
            >
              Obtener Turno
            </button>

            <button
              onClick={() => {
                navigate(`/${slug}/mis-turnos`);
                setMenuOpen(false);
              }}
              className="rounded-2xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold"
            >
              Mis turnos
            </button>

            <button
              onClick={() => {
                navigate(`/${slug}/historial`);
                setMenuOpen(false);
              }}
              className="rounded-2xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold"
            >
              🗄️ Historial
            </button>
          </>
        )
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200 bg-white/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        {/* LEFT - LOGO */}
        <Link to={`/${slug}`} className="flex items-center">
          <img
            src={logoUrl || "/placeholder-logo.png"}
            alt={nombre || "logo"}
            className="h-10 w-auto origin-left object-contain scale-[6] md:scale-[6.8]"
          />
        </Link>

        {/* CENTER (DESKTOP ONLY) */}
        <div className="hidden md:flex items-center gap-3">
          <NavLinks />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* USER + LOGOUT (DESKTOP ONLY) */}
          {token && (
            <div className="hidden lg:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.email}
                </p>
                <p className="text-xs uppercase text-gray-400">{user?.role}</p>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                Cerrar sesión
              </button>
            </div>
          )}

          {/* LOGIN (MOBILE + DESKTOP IF NO TOKEN) */}
          {!token && <GoogleLoginButton />}

          {/* HAMBURGER (MOBILE ONLY) */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 px-4 pb-4">
          <NavLinks />

          {token && (
            <>
              <div className="text-sm text-gray-700">
                <p className="font-semibold">{user?.email}</p>
                <p className="text-xs uppercase text-gray-400">{user?.role}</p>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-500 px-4 py-2 text-white text-sm"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
