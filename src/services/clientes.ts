import axios from "axios";

const api = import.meta.env.VITE_API_URL;

export const obtenerMiPerfil = async (token: string) => {
  return axios.get(`${api}/mi-perfil`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const completarPerfil = async (
  token: string,
  form: Record<string, unknown>,
) => {
  return axios.post(`${api}/completar-perfil`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const obtenerClientes = async (token: string) => {
  const response = await axios.get(`${api}/clientes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export type CrearClienteAdminBody = {
  nombre_completo: string;
  email?: string;
  fecha_nacimiento?: string;
  telefono: string;
};

export const crearClienteAdmin = async (
  token: string,
  body: CrearClienteAdminBody,
) => {
  const response = await axios.post(`${api}/admin/clientes`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const actualizarClienteAdmin = async (
  token: string,
  clienteId: number,
  body: CrearClienteAdminBody,
) => {
  const response = await axios.put(`${api}/admin/clientes/${clienteId}`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const eliminarClienteAdmin = async (
  token: string,
  clienteId: number,
) => {
  const response = await axios.delete(`${api}/admin/clientes/${clienteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
