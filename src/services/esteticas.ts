// services/esteticas.ts
import axios from "axios";

const API = "http://127.0.0.1:8000";

export async function obtenerEstetica(slug: string) {
  const response = await axios.get(`${API}/esteticas/${slug}`);

  return response.data;
}

export const actualizarEstetica = async (slug: string, data: any) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/esteticas/${slug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};
