import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";

import DashboardPage from "../pages/DashboardPage";

import AdminPage from "../pages/AdminPage";

import TurnosAdminPage from "../pages/TurnosAdminPage";

import MisTurnosPage from "../pages/MisTurnosPage";

import CompletarPerfilPage from "../pages/CompletarPerfil";
import ClientesAdminPage from "../pages/ClientesAdminPage";
import ConfigEsteticaPage from "../pages/EsteticaConfigPage";
import { EsteticaProvider } from "../context/EsteticaContext";
import AdminCrearProfesional from "../components/admin/AdminCrearProfesiona";
import CrearHorariosEsteticas from "../components/admin/CrearHorariosEstetica";

function AppRouter() {
  return (
    <BrowserRouter>
      <EsteticaProvider>
        <Routes>
          <Route path="/:slug" element={<LandingPage />} />

          <Route path="/:slug/dashboard" element={<DashboardPage />} />

          <Route path="/:slug/admin" element={<AdminPage />} />

          <Route path="/:slug/admin/turnos" element={<TurnosAdminPage />} />

          <Route path="/:slug/mis-turnos" element={<MisTurnosPage />} />
          <Route
            path="/:slug/completar-perfil"
            element={<CompletarPerfilPage />}
          />
          <Route path="/:slug/admin/config" element={<ConfigEsteticaPage />} />

          <Route
            path="/:slug/admin/profesionales"
            element={<AdminCrearProfesional />}
          />

          <Route
            path="/:slug/admin/horarios"
            element={<CrearHorariosEsteticas />}
          />

          <Route path="/:slug/admin/clientes" element={<ClientesAdminPage />} />
        </Routes>
      </EsteticaProvider>
    </BrowserRouter>
  );
}

export default AppRouter;
