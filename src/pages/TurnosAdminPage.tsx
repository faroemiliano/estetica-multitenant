import { CalendarDays } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import AdminSectionHeader from "../components/admin/AdminSectionHeader";
import ListaTurnos from "../components/admin/ListarTurnos";

function TurnosAdminPage() {
  return (
    <AdminLayout>
      <AdminSectionHeader eyebrow="Agenda" title="Turnos" description="Anotá nuevas reservas y administrá los turnos de todos tus clientes." icon={<CalendarDays size={17} />} />
      <ListaTurnos />
    </AdminLayout>
  );
}

export default TurnosAdminPage;
