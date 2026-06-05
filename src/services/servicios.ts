import axios from "axios";

const api = import.meta.env.VITE_API_URL;

export const obtenerServicios = async (token: string) => {
  const response = await axios.get(
    `${api}/servicios`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const eliminarServicio = async (token: string, servicioId: number) => {
  await axios.delete(
    `${api}/servicios/${servicioId}`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const editarServicio = async (
  token: string,

  servicioId: number,

  body: any,
) => {
  const response = await axios.put(
    `${api}/servicios/${servicioId}`,

    body,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
export const obtenerServiciosPublicos = async (slug: string) => {
  const api = import.meta.env.VITE_API_URL;

  const res = await fetch(`${api}/public/servicios/${slug}`);

  return res.json();
};
