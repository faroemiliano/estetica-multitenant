import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { EsteticaProvider, useEstetica } from "../../context/EsteticaContext";
import { useAuth } from "../../context/AuthContext";

function LayoutContent() {
  const { loading } = useEstetica();
  const { token, user } = useAuth();
  const { slug } = useParams();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-white px-6 text-center">
        <div className="mb-8 h-14 w-14 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />

        <h1 className="text-3xl font-bold text-gray-900">
          Preparando tu experiencia...
        </h1>

        <p className="mt-4 max-w-md text-gray-500">
          Estamos iniciando el espacio de la estética. Esto puede tardar unos
          segundos la primera vez si el servidor estaba inactivo.
        </p>

        <p className="mt-6 text-sm text-pink-500 font-medium animate-pulse">
          ✨ Gracias por tu paciencia
        </p>
      </div>
    );
  }

  const rutaPerfil = `/${slug}/completar-perfil`;
  const rutaInicio = `/${slug}`;
  const estaCompletandoPerfil = location.pathname === rutaPerfil;
  const estaEnInicio = location.pathname === rutaInicio || location.pathname === `${rutaInicio}/`;

  if (
    token &&
    user?.role === "cliente" &&
    user.perfil_completo === false &&
    !estaCompletandoPerfil &&
    !estaEnInicio
  ) {
    return <Navigate to={rutaPerfil} replace />;
  }

  if (!token && estaCompletandoPerfil) {
    return <Navigate to={`/${slug}`} replace />;
  }

  if (
    token &&
    user?.role === "cliente" &&
    user.perfil_completo === true &&
    estaCompletandoPerfil
  ) {
    return <Navigate to={`/${slug}/dashboard`} replace />;
  }

  return <Outlet />;
}

function EsteticaLayout() {
  return (
    <EsteticaProvider>
      <LayoutContent />
    </EsteticaProvider>
  );
}

export default EsteticaLayout;
