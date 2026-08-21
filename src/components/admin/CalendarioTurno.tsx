import { useEffect, useState } from "react";

import FullCalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { obtenerTurnosAdmin } from "../../services/turnos";
import AgendaTurnos from "./AgendaTurnos";
import { fechaHoyArgentina, formatearFechaISO } from "../../utils/fechas";

type TurnoApi = {
  id: number;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  cliente?: { email?: string };
  servicio?: { nombre?: string; descripcion?: string };
  profesional?: { nombre?: string };
};

type EventoCalendario = {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: {
    cliente?: string;
    estado: string;
    descripcion?: string;
    servicio?: string;
    profesional?: string;
  };
  color: string;
};

function CalendarioTurnos() {
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [turnosDia, setTurnosDia] = useState<EventoCalendario[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  const [isMobile, setIsMobile] = useState(false);

  // detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // load data
  useEffect(() => {
    const cargarTurnos = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const data = (await obtenerTurnosAdmin(token)) as TurnoApi[];
      const eventosFormateados: EventoCalendario[] = data.map((turno) => ({
        id: String(turno.id),
        title: turno.servicio?.nombre || "Servicio",
        start: turno.hora_inicio,
        end: turno.hora_fin,
        extendedProps: {
          cliente: turno.cliente?.email,
          estado: turno.estado,
          descripcion: turno.servicio?.descripcion,
          servicio: turno.servicio?.nombre,
          profesional: turno.profesional?.nombre,
        },
        color:
          turno.estado === "confirmado"
            ? "#10b981"
            : turno.estado === "cancelado"
              ? "#ef4444"
              : turno.estado === "finalizado"
                ? "#6b7280"
                : "#f59e0b",
      }));

      setEventos(eventosFormateados);
    };

    void cargarTurnos();
  }, []);

  // FIX timezone-safe
  const getLocalDate = (date: string | Date) => {
    const d = new Date(date);

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate(),
    ).padStart(2, "0")}`;
  };

  const hoyStr = fechaHoyArgentina();

  return (
    <div className="overflow-hidden rounded-3xl border bg-white shadow-lg">
      {/* HEADER */}
      <div className="border-b p-4">
        <h2 className="text-lg font-bold">Calendario de Turnos</h2>
        <p className="text-xs text-gray-500">Vista de reservas</p>
      </div>

      {/* MOBILE */}
      {isMobile ? (
        <div className="p-3">
          <AgendaTurnos
            eventos={eventos.filter((e) => getLocalDate(e.start) >= hoyStr)}
          />
        </div>
      ) : (
        <div className="p-4">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={esLocale}
            now={hoyStr}
            height="auto"
            contentHeight="auto"
            expandRows
            dayMaxEvents={3}
            moreLinkClick="popover"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek",
            }}
            events={eventos}
            dateClick={(info) => {
              const eventosDelDia = eventos.filter(
                (e) => getLocalDate(e.start) === info.dateStr,
              );

              setTurnosDia(eventosDelDia);
              setFechaSeleccionada(info.dateStr);
              setModalOpen(true);
            }}
          />
        </div>
      )}

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex justify-between">
              <div>
                <h2 className="text-lg font-bold">Turnos del día</h2>
                <p className="text-xs text-gray-500">
                  {formatearFechaISO(fechaSeleccionada)}
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg bg-gray-100 px-3 py-1 text-sm"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-3">
              {turnosDia.length === 0 ? (
                <div className="rounded-xl border p-4 text-center text-sm text-gray-500">
                  Sin turnos
                </div>
              ) : (
                turnosDia.map((t, i) => (
                  <div key={i} className="rounded-xl border p-3">
                    <p className="font-semibold">{t.extendedProps.servicio}</p>
                    <p className="text-xs text-gray-500">
                      {t.extendedProps.descripcion}
                    </p>

                    <div className="mt-2 text-xs">
                      Cliente: {t.extendedProps.cliente} <br />
                      Profesional: {t.extendedProps.profesional}
                    </div>

                    <span className="mt-2 inline-block text-xs font-bold">
                      {t.extendedProps.estado}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarioTurnos;
