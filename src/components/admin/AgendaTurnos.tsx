import { useMemo } from "react";

function AgendaTurnos({ eventos }: any) {
  console.log("🔥 EVENTOS:", eventos);

  // 🔥 Normaliza el día SIN UTC ni hacks
  const obtenerClaveDia = (fecha: string | Date) => {
    const d = new Date(fecha);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const claveHoy = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const obtenerHora = (fecha: string | Date) => new Date(fecha).getTime();

  const formatearDia = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString("es-AR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });

  const formatearHora = (fecha: string | Date) =>
    new Date(fecha).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const eventosAgrupados = useMemo(() => {
    const acumulador: Record<number, any[]> = {};

    console.log("⚙️ Procesando eventos...");

    eventos.forEach((turno: any) => {
      const claveDia = obtenerClaveDia(turno.start);

      console.log("📌 TURNO:", {
        id: turno.id,
        inicio: turno.start,
        claveDia,
      });

      if (!acumulador[claveDia]) acumulador[claveDia] = [];
      acumulador[claveDia].push(turno);
    });

    console.log("📦 AGRUPADOS:", acumulador);

    // ordenar turnos dentro de cada día
    Object.keys(acumulador).forEach((clave) => {
      const k = Number(clave);
      acumulador[k].sort((a, b) => obtenerHora(a.start) - obtenerHora(b.start));
    });

    // ordenar días
    const ordenado = Object.keys(acumulador)
      .map(Number)
      .sort((a, b) => a - b)
      .reduce((obj: any, clave) => {
        obj[clave] = acumulador[clave];
        return obj;
      }, {});

    console.log("📊 FINAL:", ordenado);

    return ordenado;
  }, [eventos]);

  return (
    <div className="space-y-4">
      {Object.entries(eventosAgrupados).map(([clave, items]: any) => {
        const claveDia = Number(clave);
        const esHoy = claveDia === claveHoy;

        return (
          <div
            key={clave}
            className={`rounded-2xl border p-4 ${
              esHoy ? "border-emerald-300 bg-emerald-50" : "bg-white"
            }`}
          >
            {/* HEADER DIA */}
            <div className="mb-3 flex justify-between">
              <h3 className="text-sm font-bold">
                {esHoy ? "HOY • " : ""}
                {formatearDia(claveDia)}
              </h3>

              <span className="text-xs text-gray-500">
                {items.length} turnos
              </span>
            </div>

            {/* LISTA TURNOS */}
            <div className="space-y-2">
              {items.map((turno: any) => (
                <div
                  key={turno.id}
                  className="rounded-xl border bg-gray-50 p-3"
                >
                  <div className="flex justify-between">
                    {/* INFO */}
                    <div>
                      <p className="font-semibold">
                        {turno.extendedProps?.servicio}
                      </p>
                      <p className="text-xs text-gray-500">
                        {turno.extendedProps?.profesional}
                      </p>
                    </div>

                    {/* HORA + ESTADO */}
                    <div className="text-right">
                      <p className="font-bold">{formatearHora(turno.start)}</p>

                      <span className="text-xs uppercase">
                        {turno.extendedProps?.estado}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AgendaTurnos;
