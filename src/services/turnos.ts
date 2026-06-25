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
  profesionalId: number,
  servicioId: number,
) => {
  const response = await axios.get(
    `${api}/horarios-disponibles?fecha=${fecha}&profesional_id=${profesionalId}&servicio_id=${servicioId}`,
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

export const ocultarTurno = async (token: string, turnoId: number) => {
  await axios.delete(`${api}/mis-turnos/${turnoId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const obtenerTurnosArchivados = async (token: string) => {
  const response = await axios.get(`${api}/mis-turnos-archivados`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const restaurarTurno = async (token: string, turnoId: number) => {
  await axios.put(
    `${api}/turnos/${turnoId}/mostrar`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
