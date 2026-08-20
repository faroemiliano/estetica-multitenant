import axios from "axios";
import { useEffect, useState } from "react";
import { ReceiptText } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import AdminSectionHeader from "../components/admin/AdminSectionHeader";
import CrearServicioForm from "../components/admin/CrearServicioForm";
import ListaServicios from "../components/admin/ListarServicios";
import { obtenerServicios } from "../services/servicios";

type Profesional = { id: number; nombre: string };
type Servicio = {
  id: number;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  duracion?: number;
  precio?: number;
  profesional_id?: number;
  profesional?: Profesional;
  requiere_whatsapp?: boolean;
};

function ServiciosAdminPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);

  const cargarServicios = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setServicios(await obtenerServicios(token));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    Promise.all([
      obtenerServicios(token),
      axios.get(`${import.meta.env.VITE_API_URL}/profesionales`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]).then(([listaServicios, response]) => {
      setServicios(listaServicios);
      setProfesionales(response.data);
    });
  }, []);

  return (
    <AdminLayout>
      <AdminSectionHeader eyebrow="Catálogo" title="Servicios" description="Creá servicios, asigná profesionales y mantené precios y duraciones actualizados." icon={<ReceiptText size={17} />} />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
        <CrearServicioForm recargarServicios={cargarServicios} />
        <ListaServicios servicios={servicios} recargarServicios={cargarServicios} profesionales={profesionales} />
      </div>
    </AdminLayout>
  );
}

export default ServiciosAdminPage;
