import axios from "axios";

const api = import.meta.env.VITE_API_URL;

export const crearTurno = async (token: string, body: any) => {
  const res = await axios.post(`${api}/turnos`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const obtenerMisTurnos = async (token: string) => {
  const res = await axios.get(`${api}/mis-turnos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const obtenerTurnosAdmin = async (token: string) => {
  const res = await axios.get(`${api}/turnos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const obtenerHorariosDisponibles = async (
  token: string,
  fecha: string,
) => {
  const response = await axios.get(
    `${api}/horarios-disponibles?fecha=${fecha}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const cambiarEstadoTurno = async (
  token: string,
  turnoId: number,
  estado: string,
) => {
  const response = await axios.put(
    `${api}/turnos/${turnoId}/estado?estado=${estado}`,
    {},

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const cancelarTurno = async (token: string, turnoId: number) => {
  const response = await axios.put(
    `${api}/turnos/${turnoId}/estado?estado=cancelado`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
