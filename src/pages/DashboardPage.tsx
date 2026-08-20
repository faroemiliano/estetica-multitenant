import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  MessageCircle,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { crearTurno, obtenerHorariosDisponibles } from "../services/turnos";
import { obtenerServicios } from "../services/servicios";
import { useEstetica } from "../context/EsteticaContext";

type Profesional = { id: number; nombre?: string };
type Servicio = {
  id: number;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  precio?: number;
  duracion?: number;
  requiere_whatsapp?: boolean;
  profesional_id?: number;
  profesional?: Profesional;
};

const fechaLocal = (fecha: Date) => {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
};

const mensajeError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const detalle = error.response?.data?.detail;
    if (typeof detalle === "string") return detalle;
  }
  return "No pudimos completar la operación. Intentá nuevamente.";
};

function DashboardPage() {
  const { slug } = useParams();
  const { estetica } = useEstetica();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [categoria, setCategoria] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [fecha, setFecha] = useState<Date | null>(null);
  const [horarios, setHorarios] = useState<string[]>([]);
  const [hora, setHora] = useState("");
  const [cargando, setCargando] = useState(true);
  const [buscandoHorarios, setBuscandoHorarios] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    obtenerServicios(token)
      .then((data) => setServicios(Array.isArray(data) ? data : []))
      .catch((err) => setError(mensajeError(err)))
      .finally(() => setCargando(false));
  }, []);

  const categorias = useMemo(
    () => [
      "Todos",
      ...Array.from(
        new Set(servicios.map((item) => item.categoria || "Otros")),
      ),
    ],
    [servicios],
  );

  const serviciosVisibles = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();
    return servicios.filter((item) => {
      const coincideCategoria =
        categoria === "Todos" || (item.categoria || "Otros") === categoria;
      const coincideTexto = `${item.nombre} ${item.descripcion || ""}`
        .toLowerCase()
        .includes(texto);
      return coincideCategoria && coincideTexto;
    });
  }, [busqueda, categoria, servicios]);

  const seleccionarServicio = (seleccionado: Servicio) => {
    setServicio(seleccionado);
    setFecha(null);
    setHora("");
    setHorarios([]);
    setError("");
    setExito(false);
  };

  const cerrarModal = () => {
    if (guardando) return;
    setServicio(null);
    setExito(false);
    setError("");
  };

  const seleccionarFecha = async (nuevaFecha: Date | null) => {
    setFecha(nuevaFecha);
    setHora("");
    setHorarios([]);
    setError("");

    const token = localStorage.getItem("token");
    const profesionalId =
      servicio?.profesional?.id ?? servicio?.profesional_id;
    if (!token || !nuevaFecha || !servicio || !profesionalId) return;

    setBuscandoHorarios(true);
    try {
      const disponibles = await obtenerHorariosDisponibles(
        token,
        fechaLocal(nuevaFecha),
        profesionalId,
        servicio.id,
      );
      setHorarios(Array.isArray(disponibles) ? disponibles : []);
    } catch (err) {
      setError(mensajeError(err));
    } finally {
      setBuscandoHorarios(false);
    }
  };

  const confirmarReserva = async () => {
    const token = localStorage.getItem("token");
    if (!token || !servicio || !fecha || !hora) return;

    setGuardando(true);
    setError("");
    try {
      await crearTurno(token, {
        servicio_id: servicio.id,
        fecha: fechaLocal(fecha),
        hora,
      });
      setExito(true);
    } catch (err) {
      setError(mensajeError(err));
    } finally {
      setGuardando(false);
    }
  };

  const whatsapp = estetica?.whatsapp?.replace(/\D/g, "");

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
          <Link
            to={`/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft size={17} /> Volver al inicio
          </Link>
          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-pink-600">
                <Sparkles size={16} /> Reserva online
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
                Elegí tu próximo servicio
              </h1>
              <p className="mt-4 max-w-2xl text-gray-500">
                Seleccioná una opción, elegí el día y confirmá uno de los horarios disponibles.
              </p>
            </div>
            <Link
              to={`/${slug}/mis-turnos`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <CalendarDays size={18} /> Ver mis turnos
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <input
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Buscar un servicio"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:bg-white"
          />
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {categorias.map((item) => (
              <button
                key={item}
                onClick={() => setCategoria(item)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
                  categoria === item
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {error && !servicio && (
          <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>
        )}

        {cargando ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-72 animate-pulse rounded-3xl bg-white" />
            ))}
          </div>
        ) : serviciosVisibles.length ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {serviciosVisibles.map((item) => (
              <article
                key={item.id}
                className="group flex min-h-72 flex-col rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-pink-200 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full bg-pink-50 px-3 py-1.5 text-xs font-bold text-pink-700">
                    {item.categoria || "Otros"}
                  </span>
                  {item.precio != null && (
                    <span className="text-xl font-black text-gray-900">
                      ${Number(item.precio).toLocaleString("es-AR")}
                    </span>
                  )}
                </div>
                <h2 className="mt-5 text-2xl font-black text-gray-900">{item.nombre}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                  {item.descripcion || "Conocé todos los detalles al seleccionar este servicio."}
                </p>
                <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold text-gray-500">
                  {item.duracion && <span className="flex items-center gap-1.5"><Clock3 size={15} /> {item.duracion} min</span>}
                  {item.profesional?.nombre && <span className="flex items-center gap-1.5"><UserRound size={15} /> {item.profesional.nombre}</span>}
                </div>
                <button
                  onClick={() => seleccionarServicio(item)}
                  className="mt-auto w-full rounded-xl bg-gray-900 px-5 py-3.5 text-sm font-bold text-white transition group-hover:bg-pink-600"
                >
                  {item.requiere_whatsapp ? "Consultar disponibilidad" : "Elegir fecha y horario"}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <h2 className="text-xl font-bold text-gray-800">No encontramos servicios</h2>
            <p className="mt-2 text-sm text-gray-500">Probá con otra categoría o búsqueda.</p>
          </div>
        )}
      </section>

      {servicio && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-3 backdrop-blur-sm sm:items-center">
          <div className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-pink-600">Tu selección</p>
                <h2 className="mt-1 text-xl font-black text-gray-900">{servicio.nombre}</h2>
              </div>
              <button onClick={cerrarModal} className="rounded-xl bg-gray-100 p-2 text-gray-600 hover:bg-gray-200" aria-label="Cerrar"><X size={20} /></button>
            </div>

            {exito ? (
              <div className="flex flex-col items-center px-6 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check size={32} /></div>
                <h3 className="mt-6 text-3xl font-black text-gray-900">¡Turno reservado!</h3>
                <p className="mt-3 max-w-md text-gray-500">Tu reserva se guardó correctamente. Podés consultarla desde Mis turnos.</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button onClick={cerrarModal} className="rounded-xl border border-gray-200 px-5 py-3 font-bold text-gray-700">Seguir viendo servicios</button>
                  <Link to={`/${slug}/mis-turnos`} className="rounded-xl bg-gray-900 px-5 py-3 font-bold text-white">Ver mis turnos</Link>
                </div>
              </div>
            ) : servicio.requiere_whatsapp ? (
              <div className="px-6 py-10 sm:px-10">
                <div className="mx-auto max-w-xl rounded-3xl border border-amber-200 bg-amber-50 p-7 text-center">
                  <MessageCircle className="mx-auto text-amber-700" size={38} />
                  <h3 className="mt-4 text-2xl font-black text-gray-900">Este servicio requiere coordinación</h3>
                  <p className="mt-3 leading-7 text-gray-600">Contactanos para evaluar tu caso y encontrar el turno indicado.</p>
                  {whatsapp && <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 font-bold text-white hover:bg-emerald-700"><MessageCircle size={19} /> Hablar por WhatsApp</a>}
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
                <aside className="border-b border-gray-100 bg-gray-50 p-6 lg:border-b-0 lg:border-r sm:p-8">
                  <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-700">{servicio.categoria || "Servicio"}</span>
                  <h3 className="mt-5 text-2xl font-black text-gray-900">{servicio.nombre}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">{servicio.descripcion}</p>
                  <div className="mt-6 space-y-3 border-t border-gray-200 pt-5 text-sm">
                    {servicio.precio != null && <div className="flex justify-between"><span className="text-gray-500">Precio</span><strong>${Number(servicio.precio).toLocaleString("es-AR")}</strong></div>}
                    {servicio.duracion && <div className="flex justify-between"><span className="text-gray-500">Duración</span><strong>{servicio.duracion} min</strong></div>}
                    {servicio.profesional?.nombre && <div className="flex justify-between gap-4"><span className="text-gray-500">Profesional</span><strong className="text-right">{servicio.profesional.nombre}</strong></div>}
                  </div>
                </aside>

                <div className="p-6 sm:p-8">
                  <div className="grid gap-7 sm:grid-cols-2">
                    <div>
                      <p className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs text-white">1</span> Elegí una fecha</p>
                      <div className="overflow-hidden rounded-2xl border border-gray-200">
                        <DatePicker selected={fecha} minDate={new Date()} onChange={seleccionarFecha} inline />
                      </div>
                    </div>
                    <div>
                      <p className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs text-white">2</span> Elegí un horario</p>
                      <div className="min-h-64 rounded-2xl border border-gray-200 p-4">
                        {buscandoHorarios ? <p className="py-16 text-center text-sm text-gray-500">Buscando horarios...</p> : horarios.length ? (
                          <div className="grid grid-cols-2 gap-2">
                            {horarios.map((item) => <button key={item} onClick={() => setHora(item)} className={`rounded-xl px-3 py-3 text-sm font-bold ${hora === item ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-pink-50"}`}>{item}</button>)}
                          </div>
                        ) : <p className="py-16 text-center text-sm leading-6 text-gray-400">{fecha ? "No hay horarios disponibles para este día." : "Seleccioná una fecha para ver los horarios."}</p>}
                      </div>
                    </div>
                  </div>
                  {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
                  <button disabled={!fecha || !hora || guardando} onClick={confirmarReserva} className="mt-6 w-full rounded-xl bg-gray-900 px-5 py-4 font-bold text-white hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-40">{guardando ? "Guardando turno..." : fecha && hora ? `Confirmar turno · ${fecha.toLocaleDateString("es-AR")} ${hora}` : "Elegí fecha y horario"}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default DashboardPage;
