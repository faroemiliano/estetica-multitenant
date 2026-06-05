import { useEffect, useState } from "react";
import { crearTurno, obtenerHorariosDisponibles } from "../services/turnos";
import { obtenerServicios } from "../services/servicios";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

function DashboardPage() {
  const { slug } = useParams();
  const [servicios, setServicios] = useState<any[]>([]);
  const [fecha, setFecha] = useState<Date | null>(null);
  const [horarios, setHorarios] = useState<string[]>([]);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [profesionalAbierto, setProfesionalAbierto] = useState<number | null>(
    null,
  );
  const [modalAbierto, setModalAbierto] = useState(false);

  const [servicioSeleccionado, setServicioSeleccionado] = useState<any>(null);

  useEffect(() => {
    cargarServicios();
  }, []);

  useEffect(() => {
    if (!fecha) return;

    cargarHorarios();
  }, [fecha]);

  const cargarServicios = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const data = await obtenerServicios(token);

    setServicios(data);
  };

  const cargarHorarios = async () => {
    const token = localStorage.getItem("token");

    if (!token || !fecha) return;

    const data = await obtenerHorariosDisponibles(
      token,
      fecha.toISOString().split("T")[0],
    );

    setHorarios(data);
  };

  const abrirModalReserva = (servicio: any) => {
    if (!fecha) {
      alert("Seleccioná una fecha");

      return;
    }

    if (!horaSeleccionada) {
      alert("Seleccioná un horario");

      return;
    }

    setServicioSeleccionado(servicio);

    setModalAbierto(true);
  };

  const confirmarReserva = async () => {
    const token = localStorage.getItem("token");

    if (!token || !servicioSeleccionado || !fecha) return;

    try {
      await crearTurno(token, {
        servicio_id: servicioSeleccionado.id,
        fecha: fecha.toISOString().split("T")[0],
        hora: horaSeleccionada,
      });

      alert("Turno reservado correctamente");

      setModalAbierto(false);

      setServicioSeleccionado(null);

      cargarHorarios();
    } catch (error) {
      console.log(error);
    }
  };

  const serviciosAgrupados = servicios.reduce((acc: any, servicio: any) => {
    const id = servicio.profesional?.id;
    const nombre = servicio.profesional?.nombre || "Sin profesional";

    if (!acc[id]) {
      acc[id] = {
        nombre,
        servicios: [],
      };
    }

    acc[id].servicios.push(servicio);

    return acc;
  }, {});

  return (
    <div className="flex min-h-screen justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-100 px-4 py-16">
      {/* CONTAINER */}
      <div className="flex w-full max-w-6xl flex-col items-center">
        {/* HEADER */}
        <div className="mb-16 flex flex-col items-center text-center">
          <span className="mb-5 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 px-6 py-2 text-xs font-bold uppercase tracking-[0.3em] text-white shadow-lg">
            Reserva online
          </span>

          <h1 className="max-w-3xl text-5xl font-black tracking-tight text-gray-900 md:text-6xl">
            Reservá tu turno
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            Elegí fecha, horario y servicio para vivir una experiencia premium
            de belleza y bienestar.
          </p>
        </div>

        {/* TOP FORM */}
        <div className="grid w-full gap-8 lg:grid-cols-2">
          {/* FECHA */}
          <div className="relative overflow-visible rounded-[36px] border border-pink-100 bg-white/90 p-8 shadow-[0_20px_60px_rgba(236,72,153,0.10)] backdrop-blur">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-500 to-fuchsia-500 text-2xl text-white shadow-lg">
                📅
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Elegí una fecha
                </h3>

                <p className="text-sm text-gray-500">
                  Seleccioná el día ideal para tu turno
                </p>
              </div>
            </div>

            <DatePicker
              selected={fecha}
              minDate={new Date()}
              onChange={(date: Date | null) => setFecha(date)}
              dateFormat="yyyy-MM-dd"
              popperPlacement="bottom-start"
              popperClassName="z-[9999]"
              calendarClassName="shadow-2xl border border-pink-100 rounded-3xl"
              placeholderText="Seleccionar fecha"
            />
          </div>

          {/* HORARIOS */}
          <div className="rounded-[36px] border border-fuchsia-100 bg-white/90 p-8 shadow-[0_20px_60px_rgba(217,70,239,0.10)] ">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-fuchsia-500 to-pink-500 text-2xl text-white shadow-lg">
                ⏰
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Horarios disponibles
                </h3>

                <p className="text-sm text-gray-500">
                  Elegí el horario perfecto para vos
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {horarios.length === 0 ? (
                <div className="flex w-full items-center justify-center rounded-3xl border border-dashed border-pink-200 bg-pink-50/40 py-12 text-center">
                  <p className="max-w-sm text-sm text-gray-500">
                    Seleccioná una fecha para visualizar los horarios
                    disponibles.
                  </p>
                </div>
              ) : (
                horarios.map((h) => (
                  <button
                    key={h}
                    onClick={() => setHoraSeleccionada(h)}
                    className={`rounded-2xl px-5 py-3 text-sm font-bold transition-all duration-300 ${
                      horaSeleccionada === h
                        ? "scale-105 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-xl"
                        : "border border-pink-200 bg-pink-50 text-gray-700 hover:border-pink-400 hover:bg-pink-100"
                    }`}
                  >
                    {h}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* SERVICIOS */}
        <div className="mt-10">
          <div className="mb-12 flex flex-col items-center text-center">
            <span className="mb-4 rounded-full bg-pink-100 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-pink-700">
              Servicios
            </span>

            <h2 className="text-4xl font-black text-gray-900">
              Elegí tu experiencia
            </h2>

            <p className="mt-4 max-w-2xl text-gray-500">
              Servicios premium diseñados para resaltar tu belleza y bienestar.
            </p>
          </div>

          {servicios.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-pink-200 bg-pink-50/30 py-20 text-center">
              <h3 className="text-2xl font-bold text-gray-700">
                No hay servicios disponibles
              </h3>

              <p className="mt-3 text-gray-500">
                Esta estética todavía no cargó servicios.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {Object.entries(serviciosAgrupados).map(
                ([profesionalId, data]: any) => {
                  const abierto = profesionalAbierto === Number(profesionalId);

                  return (
                    <div
                      key={profesionalId}
                      onClick={() =>
                        setProfesionalAbierto(
                          abierto ? null : Number(profesionalId),
                        )
                      }
                      className={`cursor-pointer rounded-3xl border border-pink-100 bg-white shadow-sm transition-all duration-300 ${
                        abierto ? "p-8" : "p-5"
                      }`}
                    >
                      {/* HEADER */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-gray-900">
                          {data.nombre}
                        </h3>

                        <span className="text-pink-500 font-bold">
                          {abierto ? "▲" : "▼"}
                        </span>
                      </div>

                      {/* LISTA (solo si está abierto) */}
                      {abierto && (
                        <div
                          className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3
    max-h-[420px] overflow-y-auto pr-2 md:max-h-none md:overflow-visible
  "
                        >
                          {data.servicios.map((servicio: any) => (
                            <div
                              key={servicio.id}
                              className="rounded-2xl border border-pink-100 bg-pink-50/30 p-4"
                              onClick={(e) => {
                                e.stopPropagation();
                                abrirModalReserva(servicio);
                              }}
                            >
                              <div className="flex justify-between">
                                <span className="font-bold text-gray-900">
                                  {servicio.nombre}
                                </span>

                                <span className="text-pink-600 font-bold">
                                  ${servicio.precio}
                                </span>
                              </div>

                              <p className="mt-2 text-sm text-gray-500">
                                {servicio.duracion} min
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          )}
          {/* BOTONES */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={`/${slug}`}
              className="rounded-2xl border border-pink-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-pink-50"
            >
              Volver al inicio
            </Link>

            <Link
              to={`/${slug}/mis-turnos`}
              className="rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:shadow-[0_15px_40px_rgba(236,72,153,0.35)]"
            >
              Ver mis turnos
            </Link>
          </div>
        </div>

        {/* MODAL */}
        {modalAbierto && servicioSeleccionado && fecha && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-[40px] border border-pink-100 bg-white shadow-[0_30px_100px_rgba(236,72,153,0.25)]">
              {/* TOP */}
              <div className="bg-gradient-to-br from-pink-500 via-fuchsia-500 to-rose-500 px-8 py-10 text-center text-white">
                <h2 className="text-3xl font-black">Confirmar reserva</h2>

                <p className="mt-3 text-sm text-white/80">
                  Revisá toda la información antes de confirmar
                </p>
              </div>

              {/* CONTENT */}
              <div className="space-y-5 p-8">
                <div className="rounded-3xl bg-pink-50/50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-400">
                    Servicio
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-gray-900">
                    {servicioSeleccionado.nombre}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl bg-pink-50/50 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-400">
                      Fecha
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-gray-900">
                      {fecha.toISOString().split("T")[0]}
                    </h3>
                  </div>

                  <div className="rounded-3xl bg-pink-50/50 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-400">
                      Horario
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-gray-900">
                      {horaSeleccionada}
                    </h3>
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => setModalAbierto(false)}
                    className="flex-1 rounded-2xl border border-pink-200 py-3 font-semibold text-gray-700 transition hover:bg-pink-50"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={confirmarReserva}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-500 py-3 font-bold text-white shadow-lg transition hover:shadow-[0_15px_40px_rgba(236,72,153,0.35)]"
                  >
                    Confirmar reserva
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
