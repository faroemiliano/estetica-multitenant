import axios from "axios";

const api = import.meta.env.VITE_API_URL;

export const obtenerStats = async (token: string) => {
  const res = await axios.get(`${api}/dashboard/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
