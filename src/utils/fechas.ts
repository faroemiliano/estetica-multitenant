const ZONA_HORARIA_ARGENTINA = "America/Argentina/Buenos_Aires";

export const fechaHoyArgentina = () => {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: ZONA_HORARIA_ARGENTINA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const obtener = (tipo: "year" | "month" | "day") =>
    partes.find((parte) => parte.type === tipo)?.value || "";

  return `${obtener("year")}-${obtener("month")}-${obtener("day")}`;
};

export const fechaLocalDesdeISO = (fecha: string) => {
  const [anio, mes, dia] = fecha.slice(0, 10).split("-").map(Number);
  return new Date(anio, mes - 1, dia, 12, 0, 0);
};

export const inicioHoyArgentina = () => {
  const fecha = fechaLocalDesdeISO(fechaHoyArgentina());
  fecha.setHours(0, 0, 0, 0);
  return fecha;
};

export const formatearFechaISO = (fecha: string) =>
  fechaLocalDesdeISO(fecha).toLocaleDateString("es-AR");
