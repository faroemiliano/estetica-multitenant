import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Eye,
  LayoutDashboard,
  Menu,
  Scissors,
  Settings,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";

type Vista = "cliente" | "admin";
type SeccionAdmin = "resumen" | "turnos" | "clientes" | "servicios" | "profesionales" | "horarios" | "configuracion";

const seccionesAdmin: Array<{ id: SeccionAdmin; nombre: string; icono: typeof LayoutDashboard }> = [
  { id: "resumen", nombre: "Resumen", icono: LayoutDashboard },
  { id: "turnos", nombre: "Turnos", icono: CalendarDays },
  { id: "clientes", nombre: "Clientes", icono: Users },
  { id: "servicios", nombre: "Servicios", icono: Scissors },
  { id: "profesionales", nombre: "Profesionales", icono: UserRound },
  { id: "horarios", nombre: "Horarios", icono: Clock3 },
  { id: "configuracion", nombre: "Configuración", icono: Settings },
];

const encabezadosAdmin: Record<SeccionAdmin, { titulo: string; descripcion: string }> = {
  resumen: { titulo: "Buenos días, Martina", descripcion: "Este es el resumen de Alma Estética para hoy." },
  turnos: { titulo: "Turnos", descripcion: "Consultá, anotá y administrá todas las reservas." },
  clientes: { titulo: "Clientes", descripcion: "Gestioná los datos y el historial de tus clientes." },
  servicios: { titulo: "Servicios", descripcion: "Configurá tratamientos, precios y duraciones." },
  profesionales: { titulo: "Profesionales", descripcion: "Organizá el equipo y sus especialidades." },
  horarios: { titulo: "Horarios", descripcion: "Definí los días y horarios de atención." },
  configuracion: { titulo: "Configuración", descripcion: "Personalizá la información pública de la estética." },
};

const servicios = [
  { nombre: "Limpieza facial profunda", detalle: "Renovación, hidratación y luminosidad", duracion: "60 min", precio: "$28.000" },
  { nombre: "Drenaje linfático", detalle: "Tratamiento corporal manual y relajante", duracion: "45 min", precio: "$24.000" },
  { nombre: "Manicura semipermanente", detalle: "Preparación, esmaltado y terminación", duracion: "50 min", precio: "$18.500" },
];

const turnos = [
  { hora: "09:00", cliente: "Carolina Méndez", servicio: "Limpieza facial", profesional: "Sofía", estado: "Confirmado" },
  { hora: "10:30", cliente: "Lucía Romero", servicio: "Drenaje linfático", profesional: "Valentina", estado: "Pendiente" },
  { hora: "12:00", cliente: "Paula Gómez", servicio: "Manicura", profesional: "Sofía", estado: "Confirmado" },
  { hora: "15:30", cliente: "Mariana Silva", servicio: "Masaje relajante", profesional: "Valentina", estado: "Pendiente" },
];

function ContenidoAdminDemo({ seccion }: { seccion: Exclude<SeccionAdmin, "resumen"> }) {
  if (seccion === "turnos") {
    return <div className="mt-8 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-stone-200 p-6 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-black">Agenda completa</h2><p className="mt-1 text-sm text-gray-500">4 turnos programados para hoy</p></div><button className="rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold text-white">+ Anotar cliente</button></div><div className="divide-y divide-stone-100">{turnos.map((turno) => <div key={`${turno.hora}-${turno.cliente}`} className="grid gap-3 px-6 py-5 sm:grid-cols-[75px_1.3fr_1.2fr_1fr_auto] sm:items-center"><strong className="text-pink-700">{turno.hora}</strong><div><p className="font-bold">{turno.cliente}</p><p className="text-xs text-gray-400 sm:hidden">{turno.servicio}</p></div><span className="hidden text-sm text-gray-600 sm:block">{turno.servicio}</span><span className="hidden text-sm text-gray-500 sm:block">{turno.profesional}</span><span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${turno.estado === "Confirmado" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{turno.estado}</span></div>)}</div></div>;
  }

  if (seccion === "clientes") {
    const clientes = [["Carolina Méndez", "carolina@email.com", "+54 11 4567 8910"], ["Lucía Romero", "lucia@email.com", "+54 11 5089 2231"], ["Paula Gómez", "paula@email.com", "+54 11 6741 9022"], ["Mariana Silva", "mariana@email.com", "+54 11 3320 1189"]];
    return <div className="mt-8 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-stone-200 p-6 sm:flex-row sm:items-center sm:justify-between"><input placeholder="Buscar por nombre, email o teléfono" className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-pink-400 sm:max-w-md" /><button className="rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold text-white">+ Nuevo cliente</button></div><div className="divide-y divide-stone-100">{clientes.map(([nombre, email, telefono]) => <div key={email} className="grid gap-2 px-6 py-5 sm:grid-cols-[1.2fr_1.2fr_1fr_auto] sm:items-center"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 font-black text-pink-700">{nombre[0]}</span><strong>{nombre}</strong></div><span className="text-sm text-gray-500">{email}</span><span className="text-sm text-gray-500">{telefono}</span><button className="w-fit rounded-lg border border-stone-200 px-3 py-2 text-xs font-bold">Editar</button></div>)}</div></div>;
  }

  if (seccion === "servicios") {
    return <div className="mt-8"><div className="flex justify-end"><button className="rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold text-white">+ Crear servicio</button></div><div className="mt-4 grid gap-5 md:grid-cols-3">{servicios.map((servicio) => <article key={servicio.nombre} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-700"><Sparkles size={20} /></span><h2 className="mt-5 text-lg font-black">{servicio.nombre}</h2><p className="mt-2 text-sm leading-6 text-gray-500">{servicio.detalle}</p><div className="mt-5 flex justify-between border-t border-stone-100 pt-4 text-sm"><span>{servicio.duracion}</span><strong>{servicio.precio}</strong></div><button className="mt-4 w-full rounded-xl border border-stone-200 py-2.5 text-sm font-bold">Editar servicio</button></article>)}</div></div>;
  }

  if (seccion === "profesionales") {
    const equipo = [["Sofía Benítez", "Cosmetología y manicura", "5 servicios"], ["Valentina Ruiz", "Masajes y tratamientos corporales", "4 servicios"], ["Martina López", "Depilación y cuidado facial", "3 servicios"]];
    return <div className="mt-8"><div className="flex justify-end"><button className="rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold text-white">+ Agregar profesional</button></div><div className="mt-4 grid gap-5 md:grid-cols-3">{equipo.map(([nombre, especialidad, cantidad]) => <article key={nombre} className="rounded-3xl border border-stone-200 bg-white p-6 text-center shadow-sm"><span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-2xl font-black text-pink-700">{nombre[0]}</span><h2 className="mt-5 text-xl font-black">{nombre}</h2><p className="mt-2 min-h-10 text-sm text-gray-500">{especialidad}</p><span className="mt-4 inline-flex rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-700">{cantidad}</span><button className="mt-5 w-full rounded-xl border border-stone-200 py-2.5 text-sm font-bold">Administrar</button></article>)}</div></div>;
  }

  if (seccion === "horarios") {
    const horarios = [["Lunes", "09:00", "19:00", true], ["Martes", "09:00", "19:00", true], ["Miércoles", "09:00", "19:00", true], ["Jueves", "09:00", "19:00", true], ["Viernes", "09:00", "18:00", true], ["Sábado", "09:00", "14:00", true], ["Domingo", "—", "—", false]];
    return <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"><div className="space-y-3">{horarios.map(([dia, inicio, fin, activo]) => <div key={dia as string} className="grid gap-3 rounded-2xl border border-stone-100 p-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-center"><strong>{dia as string}</strong><span className="rounded-xl bg-stone-50 px-4 py-2 text-sm">Desde: {inicio as string}</span><span className="rounded-xl bg-stone-50 px-4 py-2 text-sm">Hasta: {fin as string}</span><span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${activo ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{activo ? "Abierto" : "Cerrado"}</span></div>)}</div><button className="mt-6 rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold text-white">Guardar horarios</button></div>;
  }

  return <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold">Nombre de la estética<input defaultValue="Alma Estética" className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-pink-400" /></label><label className="text-sm font-bold">WhatsApp<input defaultValue="+54 11 5555 1234" className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-pink-400" /></label><label className="text-sm font-bold">Dirección<input defaultValue="Av. del Libertador 1250, Buenos Aires" className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-pink-400" /></label><label className="text-sm font-bold">Instagram<input defaultValue="@alma.estetica" className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-pink-400" /></label></div><label className="mt-5 block text-sm font-bold">Descripción pública<textarea defaultValue="Un espacio pensado para tu bienestar y cuidado personal." rows={4} className="mt-2 w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-pink-400" /></label><button className="mt-6 rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold text-white">Guardar configuración</button></div>;
}

function DemoPage() {
  const [vista, setVista] = useState<Vista>("cliente");
  const [servicioElegido, setServicioElegido] = useState<(typeof servicios)[number] | null>(null);
  const [reservaConfirmada, setReservaConfirmada] = useState(false);
  const [seccionAdmin, setSeccionAdmin] = useState<SeccionAdmin>("resumen");

  const cambiarVista = (nuevaVista: Vista) => {
    setVista(nuevaVista);
    setServicioElegido(null);
    setReservaConfirmada(false);
    if (nuevaVista === "admin") setSeccionAdmin("resumen");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-stone-50 text-gray-900">
      <div className="sticky top-0 z-[60] border-b border-pink-200 bg-pink-900 px-4 py-2 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="flex items-center gap-2 text-center text-xs font-bold sm:text-sm">
            <Eye size={16} /> DEMO INTERACTIVA · Los datos son ficticios y no se guarda ninguna reserva
          </p>
          <div className="flex rounded-xl bg-white/10 p-1">
            <button onClick={() => cambiarVista("cliente")} className={`rounded-lg px-4 py-2 text-xs font-bold ${vista === "cliente" ? "bg-white text-pink-900" : "text-white hover:bg-white/10"}`}>
              Vista cliente
            </button>
            <button onClick={() => cambiarVista("admin")} className={`rounded-lg px-4 py-2 text-xs font-bold ${vista === "admin" ? "bg-white text-pink-900" : "text-white hover:bg-white/10"}`}>
              Panel administrador
            </button>
          </div>
        </div>
      </div>

      {vista === "cliente" ? (
        <>
          <nav className="border-b border-stone-200 bg-white">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-600 text-xl font-black text-white">A</div>
                <div><p className="font-black">Alma Estética</p><p className="text-xs text-gray-500">Belleza y bienestar</p></div>
              </div>
              <div className="hidden items-center gap-7 text-sm font-semibold text-gray-600 md:flex">
                <span>Inicio</span><span>Servicios</span><span>Contacto</span>
                <button onClick={() => document.getElementById("demo-servicios")?.scrollIntoView({ behavior: "smooth" })} className="rounded-xl bg-pink-600 px-5 py-3 font-bold text-white hover:bg-pink-700">Reservar turno</button>
              </div>
              <Menu className="md:hidden" />
            </div>
          </nav>

          <section className="relative min-h-[620px] overflow-hidden bg-gray-900">
            <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2074&auto=format&fit=crop" alt="Salón de estética de demostración" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
            <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-5 py-20 sm:px-8">
              <div className="max-w-2xl text-white">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur"><Sparkles size={15} /> Tu momento</span>
                <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl">Sentite bien.<br />Sentite vos.</h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">Tratamientos personalizados y profesionales que cuidan cada detalle. Reservá online en pocos pasos.</p>
                <button onClick={() => document.getElementById("demo-servicios")?.scrollIntoView({ behavior: "smooth" })} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-4 font-bold text-white shadow-xl hover:bg-pink-700">Elegir un servicio <ArrowRight size={19} /></button>
              </div>
            </div>
          </section>

          <section id="demo-servicios" className="scroll-mt-32 px-5 py-20 sm:px-8 sm:py-28">
            <div className="mx-auto max-w-7xl">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-600">Servicios destacados</p>
                <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Elegí tu próximo cuidado</h2>
                <p className="mt-4 text-gray-500">Cada estética puede cargar sus propios servicios, precios, duraciones y profesionales.</p>
              </div>
              <div className="mt-12 grid gap-5 md:grid-cols-3">
                {servicios.map((servicio) => (
                  <article key={servicio.nombre} className="flex flex-col rounded-3xl border border-stone-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-pink-300 hover:shadow-xl">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-700"><Sparkles size={22} /></span>
                    <h3 className="mt-6 text-xl font-black">{servicio.nombre}</h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-gray-500">{servicio.detalle}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-5"><span className="flex items-center gap-1.5 text-sm font-semibold text-gray-500"><Clock3 size={16} />{servicio.duracion}</span><strong>{servicio.precio}</strong></div>
                    <button onClick={() => setServicioElegido(servicio)} className="mt-5 rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold text-white hover:bg-pink-700">Reservar</button>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-rose-100 px-5 py-16 sm:px-8">
            <div className="mx-auto grid max-w-5xl gap-8 text-center sm:grid-cols-3">
              {[['24 h', 'Reservas online'], ['100%', 'Agenda organizada'], ['2 min', 'Para sacar un turno']].map(([valor, texto]) => <div key={texto}><p className="text-4xl font-black text-pink-700">{valor}</p><p className="mt-2 font-semibold text-rose-800">{texto}</p></div>)}
            </div>
          </section>
        </>
      ) : (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row">
            <aside className="h-fit rounded-3xl bg-gray-950 p-5 text-white lg:sticky lg:top-28 lg:w-64">
              <div className="flex items-center gap-3 border-b border-white/10 pb-5"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-600 font-black">A</div><div><p className="font-black">Alma Estética</p><p className="text-xs text-gray-400">Administración</p></div></div>
              <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-1">
                {seccionesAdmin.map(({ id, nombre, icono: Icono }) => (
                  <button
                    key={id}
                    onClick={() => { setSeccionAdmin(id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold ${seccionAdmin === id ? "bg-pink-600 text-white" : "text-gray-300 hover:bg-white/10"}`}
                  >
                    <Icono size={18} />{nombre}
                  </button>
                ))}
              </div>
            </aside>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div><p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-pink-600"><BarChart3 size={17} /> Administración</p><h1 className="mt-2 text-4xl font-black">{encabezadosAdmin[seccionAdmin].titulo}</h1><p className="mt-2 text-gray-500">{encabezadosAdmin[seccionAdmin].descripcion}</p></div>
                <button onClick={() => cambiarVista("cliente")} className="rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-bold shadow-sm hover:bg-stone-50">Ver página pública</button>
              </div>

              {seccionAdmin === "resumen" ? (
                <>
              <div className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
                {[['8', 'Turnos de hoy'], ['3', 'Pendientes'], ['5', 'Confirmados'], ['142', 'Clientes']].map(([valor, texto], index) => <article key={texto} className={`rounded-2xl border bg-white p-5 shadow-sm ${index === 0 ? 'border-pink-300' : 'border-stone-200'}`}><p className="text-sm font-semibold text-gray-500">{texto}</p><p className="mt-2 text-3xl font-black">{valor}</p></article>)}
              </div>

              <div className="mt-6 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5"><div><h2 className="text-xl font-black">Agenda de hoy</h2><p className="mt-1 text-sm text-gray-500">Viernes 21 de agosto</p></div><button className="rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-bold text-white">+ Nuevo turno</button></div>
                <div className="divide-y divide-stone-100">
                  {turnos.map((turno) => <div key={`${turno.hora}-${turno.cliente}`} className="grid gap-3 px-6 py-5 transition hover:bg-stone-50 sm:grid-cols-[80px_1.3fr_1.2fr_1fr_auto] sm:items-center"><strong className="text-pink-700">{turno.hora}</strong><div><p className="font-bold">{turno.cliente}</p><p className="text-xs text-gray-400 sm:hidden">{turno.servicio}</p></div><span className="hidden text-sm text-gray-600 sm:block">{turno.servicio}</span><span className="hidden text-sm text-gray-500 sm:block">{turno.profesional}</span><span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${turno.estado === 'Confirmado' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{turno.estado}</span></div>)}
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <article className="rounded-3xl border border-stone-200 bg-white p-6"><h2 className="font-black">Próximos cumpleaños</h2><div className="mt-5 space-y-4">{['Julieta Suárez · mañana', 'Camila Díaz · 24 de agosto'].map((item) => <div key={item} className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">🎂</span><p className="text-sm font-semibold">{item}</p></div>)}</div></article>
                <article className="rounded-3xl bg-pink-900 p-6 text-white"><h2 className="font-black">Todo en un solo lugar</h2><p className="mt-3 text-sm leading-6 text-white/70">Administrá clientes, equipo, servicios, horarios y reservas desde cualquier dispositivo.</p><div className="mt-5 flex flex-wrap gap-2">{['Clientes', 'Servicios', 'Horarios'].map((item) => <span key={item} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold"><Check size={13} className="mr-1 inline" />{item}</span>)}</div></article>
              </div>
                </>
              ) : (
                <ContenidoAdminDemo seccion={seccionAdmin} />
              )}
            </div>
          </div>
        </section>
      )}

      {servicioElegido && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-pink-600">Reserva de demostración</p><h2 className="mt-2 text-2xl font-black">{servicioElegido.nombre}</h2></div><button onClick={() => { setServicioElegido(null); setReservaConfirmada(false); }} className="rounded-xl bg-stone-100 p-2 text-gray-600"><X size={20} /></button></div>
            {reservaConfirmada ? <div className="py-10 text-center"><CheckCircle2 className="mx-auto text-emerald-600" size={58} /><h3 className="mt-5 text-2xl font-black">¡Turno simulado!</h3><p className="mt-3 text-gray-500">En el sistema real, el turno queda guardado y aparece inmediatamente en el panel administrador.</p><button onClick={() => { setServicioElegido(null); setReservaConfirmada(false); }} className="mt-7 rounded-xl bg-pink-600 px-6 py-3 font-bold text-white">Continuar recorriendo</button></div> : <div className="mt-7"><p className="text-sm font-bold text-gray-700">Elegí una fecha</p><div className="mt-3 grid grid-cols-3 gap-2">{['Vie 21', 'Sáb 22', 'Lun 24'].map((fecha, index) => <button key={fecha} className={`rounded-xl border px-3 py-3 text-sm font-bold ${index === 0 ? 'border-pink-600 bg-pink-50 text-pink-700' : 'border-stone-200'}`}>{fecha}</button>)}</div><p className="mt-6 text-sm font-bold text-gray-700">Horarios disponibles</p><div className="mt-3 grid grid-cols-3 gap-2">{['10:00', '12:30', '16:00'].map((hora, index) => <button key={hora} className={`rounded-xl border px-3 py-3 text-sm font-bold ${index === 1 ? 'border-pink-600 bg-pink-600 text-white' : 'border-stone-200'}`}>{hora}</button>)}</div><button onClick={() => setReservaConfirmada(true)} className="mt-7 w-full rounded-xl bg-pink-600 px-5 py-4 font-bold text-white hover:bg-pink-700">Confirmar reserva simulada</button></div>}
          </div>
        </div>
      )}
    </main>
  );
}

export default DemoPage;
