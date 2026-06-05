import { useEffect, useState } from "react";

import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";

import timeGridPlugin from "@fullcalendar/timegrid";

import interactionPlugin from "@fullcalendar/interaction";

import { obtenerTurnosAdmin } from "../../services/turnos";

function CalendarioTurnos() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [turnosDia, setTurnosDia] = useState<any[]>([]);

  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  useEffect(() => {
    cargarTurnos();
  }, []);

  const cargarTurnos = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const data = await obtenerTurnosAdmin(token);

    const eventosFormateados = data.map((turno: any) => ({
      title: turno.servicio?.nombre || "Servicio",

      start: `${turno.fecha}T${turno.hora}`,

      extendedProps: {
        fecha: turno.fecha,

        hora: turno.hora,

        cliente: turno.cliente?.email,

        estado: turno.estado,

        descripcion: turno.servicio?.descripcion,

        servicio: turno.servicio?.nombre,
      },

      color:
        turno.estado === "confirmado"
          ? "#22c55e"
          : turno.estado === "cancelado"
            ? "#ef4444"
            : turno.estado === "finalizado"
              ? "#6b7280"
              : "#f59e0b",
    }));

    setEventos(eventosFormateados);
  };

  return (
    <div className="w-full rounded-2xl bg-white p-4 shadow-sm md:p-6">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Calendario</h2>
        </div>

        {/* LEYENDA */}
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span>Confirmado</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-400" />
            <span>Pendiente</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span>Cancelado</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gray-500" />
            <span>Finalizado</span>
          </div>
        </div>
      </div>

      {/* CALENDAR */}
      <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="w-full p-2">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek",
            }}
            height="auto"
            contentHeight={700}
            expandRows
            stickyHeaderDates
            dayMaxEvents={2}
            moreLinkClick="popover"
            events={eventos}
            dateClick={(info) => {
              const eventosDelDia = eventos.filter(
                (evento: any) => evento.extendedProps.fecha === info.dateStr,
              );

              setTurnosDia(eventosDelDia);

              setFechaSeleccionada(info.dateStr);

              setModalOpen(true);
            }}
          />
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Turnos del día</h2>

                    <p className="text-sm text-gray-500">{fechaSeleccionada}</p>
                  </div>

                  <button
                    onClick={() => setModalOpen(false)}
                    className="rounded-lg bg-gray-100 px-4 py-2"
                  >
                    Cerrar
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {turnosDia.length === 0 ? (
                    <p>No hay turnos</p>
                  ) : (
                    turnosDia.map((turno: any, index: number) => (
                      <div
                        key={index}
                        className="rounded-xl border border-gray-200 p-4"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="text-lg font-semibold">
                            {turno.extendedProps.servicio}
                          </h3>

                          <span className="text-sm text-gray-500">
                            {turno.extendedProps.hora}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600">
                          Cliente: {turno.extendedProps.cliente}
                        </p>

                        <p className="mt-2 text-sm">
                          {turno.extendedProps.descripcion}
                        </p>

                        <div className="mt-3">
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                            {turno.extendedProps.estado}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarioTurnos;
