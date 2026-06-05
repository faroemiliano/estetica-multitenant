import axios from "axios";

const api = import.meta.env.VITE_API_URL;

export const obtenerMiPerfil = async (token: string) => {
  return axios.get(`${api}/mi-perfil`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const completarPerfil = async (token: string, form: any) => {
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
