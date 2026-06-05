import axios from "axios";

const API = "http://127.0.0.1:8000";

export const obtenerStats = async (token: string) => {
  const res = await axios.get(`${API}/dashboard/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
