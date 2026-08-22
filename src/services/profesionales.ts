import axios from "axios";

const api = import.meta.env.VITE_API_URL;

export type Profesional = {
  id: number;
  nombre: string;
};

export type DisponibilidadProfesional = {
  id?: number;
  profesional_id?: number;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  activo: boolean;
};

const autorizacion = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export async function obtenerProfesionales(token: string) {
  const response = await axios.get<Profesional[]>(
    `${api}/profesionales`,
    autorizacion(token),
  );
  return response.data;
}

export async function crearProfesional(token: string, nombre: string) {
  const response = await axios.post<Profesional>(
    `${api}/profesionales`,
    { nombre },
    autorizacion(token),
  );
  return response.data;
}

export async function actualizarProfesional(
  token: string,
  id: number,
  nombre: string,
) {
  const response = await axios.put<Profesional>(
    `${api}/profesionales/${id}`,
    { nombre },
    autorizacion(token),
  );
  return response.data;
}

export async function eliminarProfesional(token: string, id: number) {
  await axios.delete(`${api}/profesionales/${id}`, autorizacion(token));
}

export async function obtenerDisponibilidadProfesional(
  token: string,
  id: number,
) {
  const response = await axios.get<DisponibilidadProfesional[]>(
    `${api}/profesionales/${id}/disponibilidad`,
    autorizacion(token),
  );
  return response.data;
}

export async function guardarDisponibilidadProfesional(
  token: string,
  id: number,
  disponibilidad: DisponibilidadProfesional[],
) {
  await axios.put(
    `${api}/profesionales/${id}/disponibilidad`,
    disponibilidad,
    autorizacion(token),
  );
}
