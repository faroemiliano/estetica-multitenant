import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";

import DashboardPage from "../pages/DashboardPage";

import AdminPage from "../pages/AdminPage";

import TurnosAdminPage from "../pages/TurnosAdminPage";

import MisTurnosPage from "../pages/MisTurnosPage";

import CompletarPerfilPage from "../pages/CompletarPerfil";
import ClientesAdminPage from "../pages/ClientesAdminPage";
import ConfigEsteticaPage from "../pages/EsteticaConfigPage";

import AdminCrearProfesional from "../components/admin/AdminCrearProfesiona";
import CrearHorariosEsteticas from "../components/admin/CrearHorariosEstetica";
import HistorialTurnosPage from "../pages/HistorialTurnosPage";
import EsteticaLayout from "../components/layout/EsteticaLayout";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<EsteticaLayout />}>
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
          <Route path="/:slug/historial" element={<HistorialTurnosPage />} />
          <Route path="/:slug/admin/clientes" element={<ClientesAdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
