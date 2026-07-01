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

  const [modalCategoria, setModalCategoria] = useState(false);
  const [modalReserva, setModalReserva] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    string | null
  >(null);
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState<
    number | null
  >(null);

  const [servicioSeleccionado, setServicioSeleccionado] = useState<any>(null);

  useEffect(() => {
    cargarServicios();
  }, []);

  useEffect(() => {
    console.log("useEffect ejecutado");
    console.log(fecha);
    console.log(profesionalSeleccionado);

    if (!fecha || !profesionalSeleccionado || !servicioSeleccionado) return;

    cargarHorarios();
  }, [fecha, profesionalSeleccionado, servicioSeleccionado]);

  const cargarServicios = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const data = await obtenerServicios(token);

    setServicios(data);
  };

  const cargarHorarios = async () => {
    const token = localStorage.getItem("token");

    if (!token || !fecha || !profesionalSeleccionado || !servicioSeleccionado)
      return;

    const data = await obtenerHorariosDisponibles(
      token,
      fecha.toISOString().split("T")[0],
      profesionalSeleccionado,
      servicioSeleccionado.id,
    );

    setHorarios(data);
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

      setModalReserva(false);

      setServicioSeleccionado(null);

      cargarHorarios();
    } catch (error) {
      console.log(error);
    }
  };

  const serviciosAgrupados = servicios.reduce((acc: any, servicio: any) => {
    const categoria = servicio.categoria || "Otros";

    if (!acc[categoria]) {
      acc[categoria] = [];
    }

    acc[categoria].push(servicio);

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
        </div>

        {/* <div className="grid w-full gap-8 lg:grid-cols-2">
          
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
        </div> */}

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
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 xl:grid-cols-4">
              {Object.entries(serviciosAgrupados).map(
                ([categoria, serviciosCategoria]: any) => {
                  const abierto = categoriaSeleccionada === categoria;

                  return (
                    <div
                      key={categoria}
                      onClick={() => {
                        setCategoriaSeleccionada(categoria);
                        setModalCategoria(true);
                      }}
                      className={`cursor-pointer rounded-3xl border border-pink-100 bg-white shadow-sm transition-all duration-300 ${
                        abierto ? "p-8" : "p-5"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-gray-900">
                          {categoria}

                          <div className="mt-2 text-sm text-gray-500">
                            {serviciosCategoria.length} servicios disponibles
                          </div>

                          <div className="mt-2 text-xs font-semibold text-pink-500">
                            Click para ver servicios →
                          </div>
                        </h3>

                        <span className="font-bold text-pink-500">→</span>
                      </div>
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
        {modalCategoria && categoriaSeleccionada && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
            <div className="w-full max-w-3xl rounded-[32px] bg-white p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900">
                  {categoriaSeleccionada}
                </h2>

                <button
                  onClick={() => setModalCategoria(false)}
                  className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold"
                >
                  Cerrar
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {(serviciosAgrupados[categoriaSeleccionada] || []).map(
                  (servicio: any) => (
                    <div
                      key={servicio.id}
                      onClick={() => {
                        setServicioSeleccionado(servicio);

                        setProfesionalSeleccionado(
                          servicio.profesional?.id || null,
                        );

                        setFecha(null);
                        setHorarios([]);
                        setHoraSeleccionada("");

                        setModalCategoria(false);

                        setModalReserva(true);
                      }}
                      className="cursor-pointer rounded-3xl border border-pink-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <span className="inline-block rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-600">
                        {servicio.categoria || "Otros"}
                      </span>
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-gray-900">
                          {servicio.nombre}
                        </h3>

                        <span className="rounded-full bg-pink-100 px-3 py-1 text-sm font-bold text-pink-600">
                          ${servicio.precio}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-gray-500">
                        {servicio.descripcion}
                      </p>

                      <p className="mt-3 text-xs text-gray-400">
                        {servicio.duracion} min
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        )}
        {/* MODAL */}
        {modalReserva && servicioSeleccionado && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm overflow-y-auto">
            {" "}
            <div className="w-full max-w-2xl max-h-[95vh] overflow-hidden rounded-[40px] bg-white shadow-[0_30px_120px_rgba(236,72,153,0.35)] flex flex-col">
              {" "}
              {/* HEADER */}
              <div className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 px-8 py-8 text-white">
                <h2 className="text-3xl font-black">Confirmar reserva</h2>
                <p className="mt-2 text-sm text-white/80">
                  Elegí fecha y horario para tu turno
                </p>
              </div>
              {/* CONTENT */}
              <div className="p-8 space-y-8 overflow-y-auto flex-1">
                {/* SERVICIO */}
                <div className="rounded-3xl bg-pink-50/60 p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-pink-500">
                    Servicio seleccionado
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-gray-900">
                    {servicioSeleccionado.nombre}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {servicioSeleccionado.descripcion}
                  </p>

                  <span className="mt-3 inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-bold text-pink-600">
                    ${servicioSeleccionado.precio}
                  </span>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* FECHA */}
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">
                      Seleccionar fecha
                    </p>

                    <div className="rounded-3xl border border-pink-100 p-3 shadow-sm">
                      <DatePicker
                        selected={fecha}
                        minDate={new Date()}
                        onChange={(date: Date | null) => setFecha(date)}
                        inline
                      />
                    </div>
                  </div>

                  {/* HORARIOS */}
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">
                      Horarios disponibles
                    </p>

                    <div className="max-h-[320px] overflow-y-auto rounded-3xl border border-pink-100 p-4">
                      {horarios.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-10">
                          Seleccioná una fecha para ver horarios
                        </p>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {horarios.map((h) => (
                            <button
                              key={h}
                              onClick={() => setHoraSeleccionada(h)}
                              className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
                                horaSeleccionada === h
                                  ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-lg"
                                  : "bg-pink-50 text-gray-700 hover:bg-pink-100"
                              }`}
                            >
                              {h}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* RESUMEN */}
                <div className="rounded-3xl bg-gray-50 p-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Fecha</span>
                    <span className="font-semibold">
                      {fecha ? fecha.toISOString().split("T")[0] : "-"}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Horario</span>
                    <span className="font-semibold">
                      {horaSeleccionada || "-"}
                    </span>
                  </div>
                </div>

                {/* BOTONES */}
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => setModalReserva(false)}
                    className="flex-1 rounded-2xl border border-gray-200 py-3 font-semibold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>

                  <button
                    disabled={!fecha || !horaSeleccionada}
                    onClick={confirmarReserva}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-500 py-3 font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_15px_40px_rgba(236,72,153,0.35)] transition"
                  >
                    Confirmar turno
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
