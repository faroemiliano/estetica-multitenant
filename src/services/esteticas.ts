// services/esteticas.ts
import axios from "axios";

const api = import.meta.env.VITE_API_URL;

export async function obtenerEstetica(slug: string) {
  const response = await axios.get(`${api}/esteticas/${slug}`);

  return response.data;
}

export const actualizarEstetica = async (slug: string, data: any) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${api}/esteticas/${slug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};
