import { useNavigate, Link } from "react-router-dom";

import GoogleLoginButton from "./GoogleLoginButton";

import { useParams } from "react-router-dom";

import { useEstetica } from "../context/EsteticaContext";

function Navbar() {
  const navigate = useNavigate();

  const { estetica } = useEstetica();

  const { slug } = useParams();

  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate(`/${slug}`);
  };

  return (
    <nav className="sticky top-0 z-50 flex w-full justify-center border-b border-gray-200 bg-white/80 px-6 py-4 backdrop-blur-xl">
      <div className="grid w-full max-w-7xl grid-cols-3 items-center">
        {/* LEFT */}
        <div className="flex items-center">
          <Link
            to={`/${slug}`}
            className="flex items-center gap-3 transition hover:opacity-80"
          >
            {estetica?.logo_url ? (
              <img
                src={estetica.logo_url}
                alt={estetica.nombre}
                className="h-14 w-auto object-contain"
              />
            ) : (
              <span className="text-2xl font-bold tracking-tight text-gray-900">
                {estetica?.nombre || "Estética"}
              </span>
            )}
          </Link>
        </div>

        {/* CENTER */}
        <div className="hidden items-center justify-center gap-3 md:flex">
          {token && user?.role === "admin" ? (
            <Link
              to={`/${slug}/admin`}
              className="rounded-2xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-300 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 hover:shadow-lg"
            >
              Panel Admin
            </Link>
          ) : (
            token && (
              <>
                <Link
                  to={`/${slug}/dashboard`}
                  className="rounded-2xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-300 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 hover:shadow-lg"
                >
                  Obtener Turno
                </Link>

                <Link
                  to={`/${slug}/mis-turnos`}
                  className="rounded-2xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-300 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 hover:shadow-lg"
                >
                  Mis turnos
                </Link>
                <Link
                  to={`/${slug}/historial`}
                  className="rounded-2xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-300 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 hover:shadow-lg"
                >
                  🗄️ Historial
                </Link>
              </>
            )
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-end gap-4">
          {!token ? (
            <GoogleLoginButton />
          ) : (
            <>
              {/* USER */}
              <div className="hidden text-right lg:block">
                <p className="max-w-[180px] truncate text-sm font-semibold text-gray-800">
                  {user?.email}
                </p>

                <p className="text-xs uppercase tracking-wide text-gray-400">
                  {user?.role}
                </p>
              </div>

              {/* LOGOUT */}
              <button
                onClick={logout}
                className="rounded-2xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-red-600 hover:shadow-lg"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
