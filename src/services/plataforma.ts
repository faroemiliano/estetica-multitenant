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
