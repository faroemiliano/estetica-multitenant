import { useState } from "react";
import {
  ArrowDown,
  BarChart3,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  Clock3,
  Eye,
  LayoutDashboard,
  Menu,
  MapPin,
  MessageCircle,
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
  { nombre: "Limpieza facial profunda", categoria: "Faciales", detalle: "Renovación, hidratación y luminosidad", duracion: "60 min", precio: "$28.000" },
  { nombre: "Dermaplaning", categoria: "Faciales", detalle: "Exfoliación y renovación de la piel", duracion: "50 min", precio: "$26.000" },
  { nombre: "Drenaje linfático", categoria: "Corporales", detalle: "Tratamiento corporal manual y relajante", duracion: "45 min", precio: "$24.000" },
  { nombre: "Masaje descontracturante", categoria: "Corporales", detalle: "Bienestar y alivio de tensiones", duracion: "50 min", precio: "$25.000" },
  { nombre: "Manicura semipermanente", categoria: "Manos y pies", detalle: "Preparación, esmaltado y terminación", duracion: "50 min", precio: "$18.500" },
  { nombre: "Belleza de pies", categoria: "Manos y pies", detalle: "Cuidado completo y esmaltado", duracion: "60 min", precio: "$20.000" },
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
          <nav className="sticky top-[76px] z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur-xl sm:top-[52px]">
            <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-xl font-black text-pink-600">A</div>
                <div className="min-w-0"><p className="truncate text-base font-black">Alma Estética</p><p className="hidden text-xs text-gray-500 sm:block">Belleza y bienestar</p></div>
              </div>
              <div className="hidden items-center gap-1 lg:flex">
                <a href="#demo-inicio" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">Inicio</a>
                <a href="#demo-servicios" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">Servicios</a>
                <a href="#demo-contacto" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">Contacto</a>
              </div>
              <button onClick={() => setServicioElegido(servicios[0])} className="hidden rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm hover:bg-stone-50 md:block">Continuar con Google</button>
              <Menu className="md:hidden" />
            </div>
          </nav>

          <section id="demo-inicio" className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-gray-900">
            <img src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2070&auto=format&fit=crop" alt="Espacio de Alma Estética" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/15" />
            <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center px-5 py-20 sm:px-8">
              <div className="max-w-2xl text-white">
                <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md">Belleza · bienestar · cuidado</span>
                <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">Un momento de cuidado pensado para vos</h1>
                <p className="mt-6 max-w-xl text-base leading-7 text-white/85 sm:text-lg">Conocé nuestros tratamientos, elegí el que necesitás y reservá tu turno online de forma simple.</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button onClick={() => document.getElementById("demo-servicios")?.scrollIntoView({ behavior: "smooth" })} className="flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-6 py-4 font-bold text-white shadow-lg hover:bg-pink-700"><CalendarDays size={20} /> Ver servicios</button>
                  <button className="flex items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/10 px-6 py-4 font-bold text-white backdrop-blur hover:bg-white/20"><MessageCircle size={20} /> Consultar por WhatsApp</button>
                </div>
              </div>
            </div>
            <a href="#demo-servicios" aria-label="Ver servicios" className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/30 bg-black/20 p-3 text-white backdrop-blur transition hover:bg-black/40"><ArrowDown size={20} /></a>
          </section>

          <section id="demo-servicios" className="scroll-mt-32 bg-[#faf8f6] px-5 py-20 sm:py-28">
            <div className="mx-auto w-full max-w-7xl">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-pink-600">Nuestros servicios</p>
                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Elegí el cuidado ideal para vos</h2>
                <p className="mt-5 leading-7 text-gray-500">Explorá las opciones disponibles y reservá online cuando estés lista.</p>
              </div>
              <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {Array.from(new Set(servicios.map((servicio) => servicio.categoria))).map((categoria) => {
                  const lista = servicios.filter((servicio) => servicio.categoria === categoria);
                  return <article key={categoria} className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-pink-600">Categoría</p><h3 className="mt-2 text-2xl font-black">{categoria}</h3></div><span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-700">{lista.length}</span></div><div className="mt-6 space-y-3 border-t border-gray-100 pt-5">{lista.map((servicio) => <div key={servicio.nombre} className="flex items-start gap-3"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-700"><Check size={13} strokeWidth={3} /></span><span className="text-sm font-medium leading-5 text-gray-700">{servicio.nombre}</span></div>)}</div></article>;
                })}
              </div>
              <div className="mt-12 flex justify-center">
                <button onClick={() => setServicioElegido(servicios[0])} className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-4 font-bold text-white hover:bg-pink-700">Iniciá sesión para reservar <CalendarDays size={19} /></button>
              </div>
            </div>
          </section>

          <footer id="demo-contacto" className="scroll-mt-32 bg-gray-950 text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
              <div><div className="flex items-center gap-3"><div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white font-black text-pink-600">A</div><div><p className="font-black">Alma Estética</p><p className="mt-1 text-xs text-gray-400">Belleza, bienestar y cuidado</p></div></div><p className="mt-5 max-w-sm text-sm leading-6 text-gray-400">Un espacio pensado para que te cuides, te relajes y disfrutes un momento para vos.</p></div>
              <div><h3 className="text-sm font-bold uppercase tracking-widest">Contacto</h3><div className="mt-5 space-y-4 text-sm text-gray-300"><p className="flex gap-3"><MapPin className="shrink-0 text-pink-500" size={18} />Av. del Libertador 1250, Buenos Aires</p><p className="flex gap-3"><MessageCircle className="text-pink-500" size={18} />+54 11 5555 1234</p><p className="flex gap-3"><Camera className="text-pink-500" size={18} />@alma.estetica</p></div></div>
              <div><h3 className="text-sm font-bold uppercase tracking-widest">Horarios de atención</h3><div className="mt-5 space-y-3 text-sm text-gray-300"><p className="flex gap-3"><Clock3 className="text-pink-500" size={18} />Lunes a viernes: 09:00 a 19:00</p><p className="flex gap-3"><Clock3 className="text-pink-500" size={18} />Sábados: 09:00 a 14:00</p></div></div>
            </div>
            <div className="border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-center text-xs text-gray-500 sm:flex-row sm:justify-between sm:px-8"><p>© {new Date().getFullYear()} Alma Estética. Todos los derechos reservados.</p><p>Desarrollado por Farixio</p></div></div>
          </footer>
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
