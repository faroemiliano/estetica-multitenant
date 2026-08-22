import axios from "axios";

const api = import.meta.env.VITE_API_URL;

export type CrearEsteticaBody = {
  nombre: string;
  slug: string;
  admin_email: string;
  admin_nombre?: string;
  logo_url?: string;
  color_primario?: string;
  hero_image?: string;
  instagram_url?: string;
  whatsapp?: string;
  direccion?: string;
};

export type EsteticaCreada = {
  message: string;
  id: number;
  slug: string;
  admin_email: string;
};

export type EsteticaPlataforma = {
  id: number;
  nombre: string;
  slug: string;
  activo: boolean;
  logo_url?: string | null;
  direccion?: string | null;
  admin_email?: string | null;
  created_at?: string | null;
};

export async function crearEstetica(
  provisioningKey: string,
  body: CrearEsteticaBody,
) {
  const response = await axios.post<EsteticaCreada>(
    `${api}/admin/esteticas/provision`,
    body,
    { headers: { "X-Provisioning-Key": provisioningKey } },
  );
  return response.data;
}

export async function obtenerEsteticas(provisioningKey: string) {
  const response = await axios.get<EsteticaPlataforma[]>(`${api}/admin/esteticas`, {
    headers: { "X-Provisioning-Key": provisioningKey },
  });
  return response.data;
}

export async function cambiarEstadoEstetica(
  provisioningKey: string,
  esteticaId: number,
  activo: boolean,
) {
  const response = await axios.patch(
    `${api}/admin/esteticas/${esteticaId}/estado`,
    { activo },
    { headers: { "X-Provisioning-Key": provisioningKey } },
  );
  return response.data;
}
